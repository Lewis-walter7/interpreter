import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ClientBilling from "@/components/dashboard/ClientBilling";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "client") {
    redirect("/login");
  }

  await dbConnect();
  
  const bookings = await Booking.find({ 
    clientId: (session.user as any).id,
    status: "completed"
  })
  .populate("interpreterId", "name")
  .sort({ createdAt: -1 })
  .lean();

  const totalSpent = bookings.reduce((sum, b: any) => sum + (b.price || 0), 0);

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Billing & Financials</h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest italic">Track your investment in professional linguistic partnerships.</p>
      </div>

      <ClientBilling 
        bookings={JSON.parse(JSON.stringify(bookings))} 
        totalSpent={totalSpent}
      />
    </div>
  );
}
