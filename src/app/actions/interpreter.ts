"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { completeBooking } from "./booking";
import { authOptions } from "@/lib/auth";
import Call from "@/models/Call";

/**
 * Toggles the interpreter's online/offline availability status.
 */
export async function toggleAvailability(isOnline: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectDB();

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: { "interpreterData.isOnline": isOnline } },
      { new: true }
    );

    // Notify all clients that an interpreter has changed status
    await pusherServer.trigger("marketplace", "status-update", {
      id: user._id,
      isOnline: isOnline,
      name: user.name,
      languages: user.interpreterData?.languages || []
    });

    return { success: true, isOnline: user.interpreterData.isOnline };
  } catch (error) {
    console.error("Toggle error:", error);
    return { success: false };
  }
}

/**
 * Submits KYC documents for review.
 */
export async function submitKYC(userId: string, files: { name: string, url: string, category: string }[]) {
  try {
    await connectDB();

    await User.findByIdAndUpdate(userId, {
      $set: {
        "interpreterData.status": "pending",
        "interpreterData.kycFiles": files
      }
    });

    // Notify admins that there's a new verification request
    await pusherServer.trigger("admin-events", "new-kyc-submission", {
      userId,
      timestamp: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error("KYC Submission error:", error);
    return { success: false };
  }
}

/**
 * Fetches all interpreters with 'pending' KYC status for the admin.
 */
export async function getPendingInterpreters() {
  try {
    await connectDB();
    const pending = await User.find({
      role: "interpreter",
      "interpreterData.status": "pending"
    });
    return JSON.parse(JSON.stringify(pending));
  } catch (error) {
    return [];
  }
}

/**
 * Updates an interpreter's KYC status (Approve/Reject).
 */
export async function updateInterpreterStatus(userId: string, status: "verified" | "rejected") {
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, {
      $set: { "interpreterData.status": status }
    });

    // Notify the specific interpreter about their status change
    await pusherServer.trigger(`private-user-${userId}`, "status-notification", {
      status,
      message: status === "verified" ? "Your account has been approved!" : "Your verification was rejected."
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Finalizes a session by updating interpreter stats and ratings.
 */
export async function finalizeSession(
  interpreterId: string,
  rating: number,
  durationMinutes: number,
  roomId: string,
  clientId: string
) {
  try {
    await connectDB();
    const User = (await import("@/models/User")).default;
    const { getPlatformSettings } = await import("./adminSettings");
    
    // 1. Fetch settings and calculate price (if not a booking)
    const settings = await getPlatformSettings();
    const ratePerMin = settings.call_rate_per_minute || 0.75;
    const price = Number((durationMinutes * ratePerMin).toFixed(2));

    const interpreter = await User.findById(interpreterId);
    if (!interpreter || !interpreter.interpreterData) {
      throw new Error("Interpreter not found");
    }

    const currentRating = interpreter.interpreterData.rating || 5;
    const currentReviews = interpreter.interpreterData.totalReviews || 0;
    const newAvgRating = ((currentRating * currentReviews) + rating) / (currentReviews + 1);

    // 2. Check if this is a pre-scheduled booking
    let isBooking = false;
    if (roomId && roomId.length === 24) {
      try {
        const res = await completeBooking(roomId, durationMinutes);
        if (res.success) {
          isBooking = true;
        }
      } catch (e) {
        // Not a booking, proceed as on-demand
      }
    }

    // 3. Update Interpreter Stats (Only if NOT already handled by completeBooking)
    const updateData: any = {
      $set: { "interpreterData.rating": newAvgRating },
      $inc: { "interpreterData.totalReviews": 1 }
    };

    if (!isBooking) {
      // On-demand specific stats
      updateData.$inc["interpreterData.totalMinutes"] = durationMinutes;
      updateData.$inc["interpreterData.totalSessions"] = 1;
      updateData.$inc["interpreterData.balance"] = price;
    }

    await User.findByIdAndUpdate(interpreterId, updateData);

    // 4. Update/Create the Call Record
    // We try to find the 'ongoing' record created by initiateCall
    const existingCall = await Call.findOneAndUpdate(
      { roomId, status: "ongoing" },
      {
        duration: durationMinutes,
        rating,
        status: "completed",
        price: isBooking ? 0 : price, // Price is 0 for on-demand calls if its a booking (already paid)
        endTime: new Date(),
      },
      { new: true }
    );

    // If no existing call (shouldn't happen with new logic), create one
    if (!existingCall) {
      await Call.create({
        roomId,
        clientId,
        interpreterId,
        duration: durationMinutes,
        rating,
        status: "completed",
        price: isBooking ? 0 : price,
        startTime: new Date(Date.now() - durationMinutes * 60000), 
        endTime: new Date(),
      });
    }

    revalidatePath("/dashboard/interpreter");

    // 5. Notify the interpreter
    await pusherServer.trigger(`private-user-${interpreterId}`, "stats-update", {
      rating: newAvgRating,
      totalMinutes: (interpreter.interpreterData.totalMinutes || 0) + (isBooking ? 0 : durationMinutes),
      totalSessions: (interpreter.interpreterData.totalSessions || 0) + (isBooking ? 0 : 1),
      totalReviews: (interpreter.interpreterData.totalReviews || 0) + 1
    });

    return { success: true };
  } catch (error) {
    console.error("Finalize session error:", error);
    return { success: false };
  }
}
