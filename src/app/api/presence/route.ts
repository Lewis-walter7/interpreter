import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    if (!bodyText) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { userId, isOnline } = JSON.parse(bodyText);

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { "interpreterData.isOnline": isOnline } },
      { new: true }
    );

    if (user) {
      // Notify clients about the status change
      await pusherServer.trigger("marketplace", "status-update", {
        id: user._id,
        isOnline: isOnline,
        name: user.name,
        languages: user.interpreterData?.languages || []
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Presence API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
