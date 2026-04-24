import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import InvoiceTemplate from "@/components/dashboard/InvoiceTemplate";

export default async function ClientInvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "client") {
    redirect("/login");
  }

  await dbConnect();
  
  const booking = await Booking.findById(params.id)
    .populate("clientId", "name email")
    .populate("interpreterId", "name email interpreterData")
    .lean();

  if (!booking || booking.clientId._id.toString() !== (session.user as any).id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Document Not Found</h1>
        <p className="text-gray-500 text-sm mt-2">You do not have permission to view this invoice.</p>
      </div>
    );
  }

  return (
    <div className="py-20 px-8">
      <div className="mb-12">
         <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Financial Records</h1>
         <p className="text-gray-500 text-xs font-black uppercase tracking-widest italic">LinguistBridge Audit Service</p>
      </div>
      
      <InvoiceTemplate 
        type="invoice" 
        booking={JSON.parse(JSON.stringify(booking))} 
      />
    </div>
  );
}
