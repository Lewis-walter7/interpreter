import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { roomId, data } = await req.json();

    // Relay the signaling data to the room-specific channel
    await pusherServer.trigger(`room-${roomId}`, "signal", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signaling Error:", error);
    return NextResponse.json({ error: "Failed to send signal" }, { status: 500 });
  }
}
