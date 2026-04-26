"use server";

import { pusherServer } from "@/lib/pusher";

export async function initiateCall(interpreterId: string, callerName: string, callerId: string, roomId: string) {
  try {
    await (await import("@/lib/mongodb")).default();
    const Call = (await import("@/models/Call")).default;

    // Create an ongoing session record
    await Call.create({
      roomId,
      clientId: callerId,
      interpreterId,
      status: "ongoing",
      startTime: new Date()
    });

    // Send a notification to the specific interpreter
    await pusherServer.trigger(`private-user-${interpreterId}`, "incoming-call", {
      callerName,
      callerId,
      roomId,
      type: "video"
    });

    return { success: true };
  } catch (error) {
    console.error("Error initiating call:", error);
    return { success: false };
  }
}

export async function respondToCall(roomId: string, accepted: boolean, callerId: string) {
  try {
    if (!accepted) {
      await (await import("@/lib/mongodb")).default();
      const Call = (await import("@/models/Call")).default;
      await Call.findOneAndUpdate({ roomId, status: "ongoing" }, { status: "cancelled" });
    }

    // Notify the caller of the decision
    await pusherServer.trigger(`private-user-${callerId}`, "call-response", {
      accepted,
      roomId
    });

    return { success: true };
  } catch (error) {
    console.error("Error responding to call:", error);
    return { success: false };
  }
}
