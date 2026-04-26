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
  
  const userId = (session.user as any).id;
  const bookings = await Booking.find({ 
    interpreterId: userId 
  })
  .populate("clientId", "name image")
  .sort({ startTime: -1 })
  .lean();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Session History</h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest italic">A professional record of all linguistic services provided.</p>
      </div>

      <CallHistory 
        initialBookings={JSON.parse(JSON.stringify(bookings))} 
        userId={userId}
        userRole="interpreter"
      />
    </div>
  );
}
