import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CallHistory from "@/components/dashboard/CallHistory";

export default async function InterpreterHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "interpreter") {
    redirect("/login");
  }

  await dbConnect();
  const Call = (await import("@/models/Call")).default;
  
  const userId = (session.user as any).id;

  // Fetch Bookings
  const bookings = await Booking.find({ interpreterId: userId })
    .populate("clientId", "name image")
    .sort({ startTime: -1 })
    .lean();

  // Fetch Real Calls
  const calls = await Call.find({ interpreterId: userId })
    .populate("clientId", "name image")
    .sort({ startTime: -1 })
    .lean();

  // Unify data
  const unifiedHistory = [
    ...bookings.map((b: any) => ({
      ...b,
      type: "booking",
      duration: b.durationMinutes * 60 || 0 // convert to seconds
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
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Session History</h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest italic">A professional record of all linguistic services provided.</p>
      </div>

      <CallHistory 
        initialBookings={JSON.parse(JSON.stringify(unifiedHistory))} 
        userId={userId}
        userRole="interpreter"
      />
    </div>
  );
}
