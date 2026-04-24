"use client";

import React from "react";
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Globe, 
  Mail, 
  Phone,
  FileText,
  Clock,
  User,
  CreditCard
} from "lucide-react";

interface InvoiceProps {
  type: "invoice" | "receipt";
  booking: any;
  clientInfo?: any;
  interpreterInfo?: any;
}

export default function InvoiceTemplate({ type, booking, clientInfo, interpreterInfo }: InvoiceProps) {
  const isInvoice = type === "invoice";
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 md:p-16 rounded-[40px] shadow-2xl print:shadow-none print:p-0 print:rounded-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        <div>
           <div className="flex items-center gap-3 mb-6 bg-slate-900 text-white w-fit px-4 py-2 rounded-xl">
              <Globe className="w-6 h-6 text-blue-500" />
              <span className="font-black tracking-tighter text-xl">LINGUISTBRIDGE</span>
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
              {isInvoice ? "Tax Invoice" : "Earnings Receipt"}
           </h1>
           <p className="text-slate-500 font-mono text-sm">REF: #{booking._id.toUpperCase()}</p>
        </div>
        
        <div className="text-right space-y-1">
           <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Issued By</p>
           <p className="font-bold text-sm">LinguistBridge Professional</p>
           <p className="text-slate-500 text-xs font-medium">Global Linguistic Gateway</p>
           <p className="text-slate-500 text-xs font-medium italic">finance@linguistbridge.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 pb-16 border-b border-slate-100">
         {/* Bill To / Earned By */}
         <div className="space-y-4">
            <h2 className="font-black text-[10px] text-blue-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
               {isInvoice ? <CreditCard className="w-3 h-3" /> : <User className="w-3 h-3" />}
               {isInvoice ? "Billed To" : "Linguist Expert"}
            </h2>
            <div className="space-y-1">
               <p className="text-xl font-black tracking-tight">
                  {isInvoice ? (booking.clientId?.name || "Client Holder") : (booking.interpreterId?.name || "Linguist Expert")}
               </p>
               <p className="text-slate-500 text-sm font-medium">{isInvoice ? booking.clientId?.email : booking.interpreterId?.email}</p>
               <p className="text-slate-400 text-xs italic">Verified Member since {new Date().getFullYear()}</p>
            </div>
         </div>

         {/* Meta Info */}
         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
               <p className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Date Issued</p>
               <p className="font-bold text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
               <p className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Status</p>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="font-black text-xs uppercase tracking-widest text-green-600">Paid & Settled</p>
               </div>
            </div>
            <div className="space-y-1">
               <p className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Service Type</p>
               <p className="font-bold text-sm tracking-tight">{booking.serviceType}</p>
            </div>
            <div className="space-y-1">
               <p className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Pricing Model</p>
               <p className="font-bold text-sm tracking-tight">Hourly Rate</p>
            </div>
         </div>
      </div>

      {/* Main Table */}
      <table className="w-full mb-16">
         <thead>
            <tr className="border-b-2 border-slate-900">
               <th className="py-4 text-left font-black text-xs uppercase tracking-widest">Description</th>
               <th className="py-4 text-center font-black text-xs uppercase tracking-widest">Duration</th>
               <th className="py-4 text-center font-black text-xs uppercase tracking-widest">Rate</th>
               <th className="py-4 text-right font-black text-xs uppercase tracking-widest">Subtotal</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            <tr>
               <td className="py-8">
                  <p className="font-black text-lg tracking-tight mb-1">Professional Interpretation Session</p>
                  <p className="text-slate-500 text-xs font-medium italic">Handled by expert: {booking.interpreterId?.name}</p>
                  <div className="flex items-center gap-4 mt-4">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {new Date(booking.startTime).toLocaleTimeString()}
                     </div>
                  </div>
               </td>
               <td className="py-8 text-center text-slate-900 font-bold">{booking.durationMinutes} min</td>
               <td className="py-8 text-center text-slate-900 font-bold">
                  ${booking.interpreterId?.interpreterData?.hourlyRate || 40}/hr
               </td>
               <td className="py-8 text-right text-slate-900 font-black italic text-lg">
                  ${booking.price?.toFixed(2)}
               </td>
            </tr>
         </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
         <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between items-center text-slate-400">
               <span className="text-xs font-black uppercase tracking-widest">Platform Fee (0%)</span>
               <span className="font-bold">$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-900">
               <span className="text-lg font-black uppercase tracking-widest">Total Amount</span>
               <span className="text-3xl font-black italic text-blue-600">${booking.price?.toFixed(2)}</span>
            </div>
         </div>
      </div>

      {/* Footer / Protection */}
      <div className="bg-slate-50 rounded-3xl p-8 mb-8 print:bg-white print:border print:border-slate-100">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
               <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <div>
               <h4 className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">Verified Audit Trail</h4>
               <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-md mt-1 italic">
                  This document serves as an official record of service provided. Authenticity can be verified via the LinguistBridge Professional Gateway using the reference ID provided.
               </p>
            </div>
         </div>
      </div>

      {/* Actions (Hidden on Print) */}
      <div className="flex items-center justify-end gap-4 print:hidden">
         <button 
           onClick={handlePrint}
           className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
         >
            <Printer className="w-4 h-4" />
            Print Copy
         </button>
         <button 
           className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20"
         >
            <Download className="w-4 h-4" />
            Save as PDF
         </button>
      </div>
    </div>
  );
}
