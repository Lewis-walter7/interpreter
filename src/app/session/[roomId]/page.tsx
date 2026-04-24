import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import VideoRoom from "@/components/dashboard/VideoRoom";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function SessionPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);
  if (!rawUser) redirect("/login");

  // Convert to plain object for client component
  const user = JSON.parse(JSON.stringify(rawUser));

  // Determine role for WebRTC signaling logic
  // The client (caller) initiates the offer, the interpreter (callee) responds
  const isCaller = user.role === "client";

  return (
    <main className="min-h-screen bg-black">
      <VideoRoom 
        roomId={roomId} 
        user={{
          id: user._id,
          name: user.name,
          role: user.role
        }}
        isCaller={isCaller}
      />
    </main>
  );
}
