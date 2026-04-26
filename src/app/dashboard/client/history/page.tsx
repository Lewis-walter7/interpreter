import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CallHistory from "@/components/dashboard/CallHistory";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "client") {
    redirect("/login");
  }

  await dbConnect();
  const Call = (await import("@/models/Call")).default;
  
  const userId = (session.user as any).id;

  // Fetch Bookings
  const bookings = await Booking.find({ clientId: userId })
    .populate("interpreterId", "name image")
    .sort({ startTime: -1 })
    .lean();

  // Fetch Real Calls
  const calls = await Call.find({ clientId: userId })
    .populate("interpreterId", "name image")
    .sort({ startTime: -1 })
    .lean();

  // Unify data
  const unifiedHistory = [
    ...bookings.map((b: any) => ({
      ...b,
      type: "booking",
      duration: b.durationMinutes * 60 || 0 // convert to seconds for UI consistency
    })),
    ...calls.map((c: any) => ({
      ...c,
      type: "call",
      duration: c.duration * 60 || 0 // convert minutes to seconds
    }))
  ].sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Call History</h1>
        <p className="text-gray-500 text-sm font-medium">A complete record of all your professional connections.</p>
      </div>

      <CallHistory 
        initialBookings={JSON.parse(JSON.stringify(unifiedHistory))} 
        userId={(session.user as any).id}
        userRole="client"
      />
    </div>
  );
}
