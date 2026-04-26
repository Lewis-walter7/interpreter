"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Call from "@/models/Call";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Fetches high-level statistics for the Admin Dashboard.
 */
export async function getAdminStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const Booking = (await import("@/models/Booking")).default;

    const interpretersCount = await User.countDocuments({ role: "interpreter" });
    const clientsCount = await User.countDocuments({ role: "client" });
    
    // Calculate total revenue from completed Bookings
    const bookingsRevenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    // Calculate total revenue from completed Calls (on-demand)
    const callsRevenue = await Call.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const totalRevenue = (bookingsRevenue[0]?.total || 0) + (callsRevenue[0]?.total || 0);

    // Active sessions are those currently 'ongoing'
    const activeSessions = await Call.countDocuments({ status: "ongoing" });

    return {
      totalRevenue: Math.round(totalRevenue),
      activeSessions,
      interpretersCount,
      clientsCount
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return {
      totalRevenue: 0,
      activeSessions: 0,
      interpretersCount: 0,
      clientsCount: 0
    };
  }
}

/**
 * Fetches all users by role for admin management.
 */
export async function getAllUsers(role: "client" | "interpreter") {
  try {
    await connectDB();
    const users = await User.find({ role }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
}

/**
 * Updates a user's account status (active/deactivated).
 */
export async function updateUserAccountStatus(userId: string, status: "active" | "deactivated") {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized");
    }

    await connectDB();
    await User.findByIdAndUpdate(userId, { status });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Account status update error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches all call sessions for the admin.
 */
export async function getAllSessions() {
  try {
    await connectDB();
    const sessions = await Call.find({})
      .populate("clientId", "name email")
      .populate("interpreterId", "name email")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(sessions));
  } catch (error) {
    return [];
  }
}
