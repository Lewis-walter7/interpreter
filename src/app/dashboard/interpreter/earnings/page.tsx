import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import InterpreterEarnings from "@/components/dashboard/InterpreterEarnings";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "interpreter") {
    redirect("/login");
  }

  await dbConnect();
  
  const userId = (session.user as any).id;
  const user = await User.findById(userId).lean();
  
  const bookings = await Booking.find({ 
    interpreterId: userId,
    status: "completed"
  })
  .populate("clientId", "name")
  .sort({ createdAt: -1 })
  .lean();

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Professional Earnings</h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest italic">A transparent record of your expertise and platform impact.</p>
      </div>

      <InterpreterEarnings 
        bookings={JSON.parse(JSON.stringify(bookings))} 
        userData={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
