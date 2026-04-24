"use server";

import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/actions/notifications";

export async function createBooking(data: {
  interpreterId: string;
  clientId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) {
  try {
    await connectDB();
    
    const start = new Date(data.startTime);
    if (start.getTime() < Date.now()) {
      throw new Error("Cannot book in the past");
    }

    const booking = await Booking.create({
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: "pending"
    });

    const populatedBooking = await Booking.findById(booking._id).populate("clientId", "name email");

    // Persist notification in DB
    await createNotification({
      userId: data.interpreterId,
      type: "booking_new",
      title: "New Booking Request",
      message: `You have a new request from ${populatedBooking.clientId.name}`,
      link: "/dashboard/interpreter/schedule"
    });

    // Notify the interpreter in real-time
    await pusherServer.trigger(`private-user-${data.interpreterId}`, "new-booking", {
      booking: JSON.parse(JSON.stringify(populatedBooking)),
      message: "You have a new booking request!"
    });

    revalidatePath("/dashboard/interpreter/schedule");
    return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "cancelled") {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true })
      .populate("clientId")
      .populate("interpreterId", "name");
    
    if (!booking) throw new Error("Booking not found");

    const recipientId = booking.clientId._id?.toString() || booking.clientId.toString();

    // Persist notification in DB
    await createNotification({
      userId: recipientId,
      type: `booking_${status}`,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking with ${booking.interpreterId.name} has been ${status}`,
      link: "/dashboard/client"
    });

    // Notify the client in real-time
    await pusherServer.trigger(`private-user-${recipientId}`, "booking-update", {
      bookingId: booking._id.toString(),
      status,
      message: `Your booking with ${booking.interpreterId.name} has been ${status}`
    });

    revalidatePath("/dashboard/interpreter/schedule");
    return { success: true };
  } catch (error: any) {
    console.error("Booking update error:", error);
    return { success: false, error: error.message };
  }
}

export async function getInterpreterBookings(interpreterId: string) {
  try {
    await connectDB();
    const bookings = await Booking.find({ interpreterId })
      .populate("clientId", "name email")
      .sort({ startTime: 1 });
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return [];
  }
}
export async function getClientBookings(clientId: string) {
  try {
    await connectDB();
    const bookings = await Booking.find({ clientId })
      .populate("interpreterId", "name email specialty bio image")
      .sort({ startTime: 1 });
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Fetch client bookings error:", error);
    return [];
  }
}
export async function completeBooking(bookingId: string, actualDuration?: number) {
  try {
    await connectDB();
    const User = (await import("@/models/User")).default;
    
    // 1. Fetch booking with full relations
    const booking = await Booking.findById(bookingId)
      .populate("clientId")
      .populate("interpreterId");
    
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "completed") return { success: true, message: "Already completed" };

    // 2. Calculate Duration (Actual or Scheduled)
    // If actualDuration is not provided, we calculate based on the time elapsed since startTime
    const sessionDuration = actualDuration || Math.max(1, Math.round((Date.now() - new Date(booking.startTime).getTime()) / (1000 * 60)));
    
    // 3. Calculate Pay based on Interpreter's Hourly Rate
    const hourlyRate = booking.interpreterId.interpreterData?.hourlyRate || 40;
    const price = Number(((sessionDuration / 60) * hourlyRate).toFixed(2));

    // 4. Update the Booking record with financial data
    booking.status = "completed";
    booking.price = price;
    booking.durationMinutes = sessionDuration;
    await booking.save();

    // 5. Update Interpreter Balance and Stats
    await User.findByIdAndUpdate(booking.interpreterId._id, {
      $inc: { 
        "interpreterData.balance": price,
        "interpreterData.totalMinutes": sessionDuration,
        "interpreterData.totalSessions": 1
      }
    });
    
    const recipientId = booking.clientId._id?.toString() || booking.clientId.toString();

    // 6. Notify both parties
    await createNotification({
      userId: recipientId,
      type: "system",
      title: "Session Completed",
      message: `Your session with ${booking.interpreterId.name} has been completed. Fee: $${price}`,
      link: "/dashboard/client/billing"
    });

    await createNotification({
      userId: booking.interpreterId._id.toString(),
      type: "system",
      title: "Earnings Credited",
      message: `You earned $${price} for your ${sessionDuration}min session.`,
      link: "/dashboard/interpreter/earnings"
    });

    // 7. Trigger Real-time updates
    await pusherServer.trigger(`private-user-${recipientId}`, "booking-update", {
      bookingId: booking._id.toString(),
      status: "completed",
      message: "Your session has been completed!"
    });

    revalidatePath("/dashboard/interpreter/schedule");
    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/client/billing");
    
    return { success: true, price, sessionDuration };
  } catch (error: any) {
    console.error("Booking completion error:", error);
    return { success: false, error: error.message };
  }
}
