import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;
    const userId = (session.user as any).id;

    // Security Check: Only allow users to subscribe to their own private channel
    // Format: private-user-{userId}
    if (channel === `private-user-${userId}`) {
      const auth = pusherServer.authenticate(socketId, channel, {
        user_id: userId,
        user_info: {
          name: session.user?.name,
          email: session.user?.email,
        },
      });
      return NextResponse.json(auth);
    }

    return new NextResponse("Forbidden", { status: 403 });
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
