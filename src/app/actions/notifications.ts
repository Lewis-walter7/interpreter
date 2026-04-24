"use server";

import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  try {
    await connectDB();
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await connectDB();
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await connectDB();
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await connectDB();
    await Notification.findByIdAndDelete(notificationId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Utility to create notifications server-side
export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    await connectDB();
    const notification = await Notification.create(data);
    return JSON.parse(JSON.stringify(notification));
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
}
