"use server";

import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitReport(data: {
  reportedUserId: string;
  callId?: string;
  reason: string;
  description: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectDB();

    const report = await Report.create({
      reporterId: (session.user as any).id,
      reportedUserId: data.reportedUserId,
      callId: data.callId,
      reason: data.reason,
      description: data.description,
      status: "pending",
    });

    return { success: true, report: JSON.parse(JSON.stringify(report)) };
  } catch (error: any) {
    console.error("Report submission error:", error);
    return { success: false, error: error.message };
  }
}

export async function getReports() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const reports = await Report.find({})
      .populate("reporterId", "name email role")
      .populate("reportedUserId", "name email role")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(reports));
  } catch (error) {
    console.error("Fetch reports error:", error);
    return [];
  }
}

export async function resolveReport(reportId: string, status: "resolved" | "dismissed", adminNotes?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized");
    }

    await connectDB();
    await Report.findByIdAndUpdate(reportId, {
      status,
      adminNotes,
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Resolve report error:", error);
    return { success: false, error: error.message };
  }
}
