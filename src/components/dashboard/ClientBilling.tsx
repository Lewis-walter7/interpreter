"use client";

import React from "react";
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Download, 
  History,
  ShieldCheck,
  DollarSign,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClientBilling({ bookings, totalSpent }: { bookings: any[], totalSpent: number }) {
  return (
    <div className="space-y-12">
      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Spent Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass-dark p-10 rounded-[48px] border border-white/5 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent relative overflow-hidden group"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 group-hover:bg-blue-500/20 transition-all duration-1000" />
          
          <div className="flex items-start justify-between mb-12">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-blue-500 uppercase tracking-widest border border-white/5 transition-all">
              Statement <Download className="w-3 h-3" />
            </button>
          </div>

          <div>
             <h2 className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mb-2 italic">Total Platform Investment</h2>
             <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white italic tracking-tighter">${totalSpent.toLocaleString()}</span>
                <span className="text-blue-500 text-sm font-black italic">USD</span>
             </div>
          </div>

          <div className="mt-12 flex items-center gap-6">
             <div className="flex items-center gap-2 text-[11px] font-bold text-green-500/80 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                <TrendingUp className="w-3 h-3" />
                VERIFIED PAYMENTS
             </div>
             <div className="h-1 w-1 rounded-full bg-gray-800" />
             <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Across {bookings.length} completed sessions</p>
          </div>
        </motion.div>

        {/* Secondary Stat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark p-10 rounded-[48px] border border-white/5 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="space-y-6">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
             </div>
             <div>
                <h3 className="text-white font-bold text-lg tracking-tight">Financial Security</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed mt-2 uppercase tracking-tighter italic">All transactions are encrypted and audited through our premium linguistic gateway.</p>
             </div>
          </div>

          <Link href="/dashboard/client/billing/methods" className="mt-8 flex items-center justify-between text-[10px] font-black text-blue-500 uppercase tracking-widest hover:translate-x-2 transition-transform">
             Payment Methods <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Transaction History Section */}
      <div>
         <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-xl font-bold flex items-center gap-4 text-white">
               <History className="w-6 h-6 text-blue-500" />
               Transaction Vault
            </h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Live Audit</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
         </div>

         <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Reference</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Linguist expert</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Service type</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Date</th>
                     <th className="px-8 py-6 text-right text-[10px] font-black text-blue-500 uppercase tracking-widest">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {bookings.length > 0 ? bookings.map((booking: any) => (
                     <tr key={booking._id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                           <a 
                             href={`/dashboard/client/invoice/${booking._id}`}
                             className="text-xs font-mono text-gray-500 hover:text-blue-500 transition-colors uppercase flex items-center gap-2 group/ref"
                           >
                              #{booking._id.slice(-8)}
                              <FileText className="w-3 h-3 opacity-0 group-hover/ref:opacity-100 transition-opacity" />
                           </a>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-white tracking-tight">{booking.interpreterId?.name || "Linguist Expert"}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">{booking.serviceType}</span>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-medium text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-sm font-black text-white italic tracking-tight">${(booking.price || 0).toLocaleString()}</span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                           <CreditCard className="w-12 h-12 text-white/5 mx-auto mb-4" />
                           <p className="text-gray-600 text-xs font-black uppercase tracking-widest">No financial records generated yet</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

// Helper Link for internal component use
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
   return (
      <a href={href} className={className}>{children}</a>
   );
}
