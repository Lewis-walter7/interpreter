import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import InvoiceTemplate from "@/components/dashboard/InvoiceTemplate";

export default async function InterpreterInvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "interpreter") {
    redirect("/login");
  }

  await dbConnect();
  
  const booking = await Booking.findById(params.id)
    .populate("clientId", "name email")
    .populate("interpreterId", "name email interpreterData")
    .lean();

  if (!booking || booking.interpreterId._id.toString() !== (session.user as any).id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Receipt Not Found</h1>
        <p className="text-gray-500 text-sm mt-2">You do not have permission to view this receipt.</p>
      </div>
    );
  }

  return (
    <div className="py-20 px-8">
      <div className="mb-12">
         <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Earnings Verification</h1>
         <p className="text-gray-500 text-xs font-black uppercase tracking-widest italic">LinguistBridge Professional Services</p>
      </div>
      
      <InvoiceTemplate 
        type="receipt" 
        booking={JSON.parse(JSON.stringify(booking))} 
      />
    </div>
  );
}
