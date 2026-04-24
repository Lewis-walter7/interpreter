"use server";

import { pusherServer } from "@/lib/pusher";

export async function initiateCall(interpreterId: string, callerName: string, callerId: string, roomId: string) {
  try {
    // Send a notification to the specific interpreter
    await pusherServer.trigger(`user-${interpreterId}`, "incoming-call", {
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
    // Notify the caller of the decision
    await pusherServer.trigger(`user-${callerId}`, "call-response", {
      accepted,
      roomId
    });

    return { success: true };
  } catch (error) {
    console.error("Error responding to call:", error);
    return { success: false };
  }
}
