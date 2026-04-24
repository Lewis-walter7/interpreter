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
  
  const bookings = await Booking.find({ 
    clientId: (session.user as any).id 
  })
  .populate("interpreterId", "name image")
  .sort({ startTime: -1 })
  .lean();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Call History</h1>
        <p className="text-gray-500 text-sm font-medium">A complete record of all your professional connections.</p>
      </div>

      <CallHistory 
        initialBookings={JSON.parse(JSON.stringify(bookings))} 
        userId={(session.user as any).id}
      />
    </div>
  );
}
