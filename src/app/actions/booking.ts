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
export async function completeBooking(bookingId: string) {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: "completed" }, { new: true })
      .populate("clientId")
      .populate("interpreterId", "name");
    
    if (!booking) throw new Error("Booking not found");
    
    const recipientId = booking.clientId._id?.toString() || booking.clientId.toString();

    // Persist notification for both
    await createNotification({
      userId: recipientId,
      type: "system",
      title: "Session Completed",
      message: `Your session with ${booking.interpreterId.name} has been marked as completed. Thank you!`,
      link: "/dashboard/client"
    });

    // Notify the client in real-time
    await pusherServer.trigger(`private-user-${recipientId}`, "booking-update", {
      bookingId: booking._id.toString(),
      status: "completed",
      message: "Your session has been completed!"
    });

    revalidatePath("/dashboard/interpreter/schedule");
    revalidatePath("/dashboard/client");
    return { success: true };
  } catch (error: any) {
    console.error("Booking completion error:", error);
    return { success: false, error: error.message };
  }
}
