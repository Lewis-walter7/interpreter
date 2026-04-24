"use client";

import React from "react";
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  FileText,
  History,
  ShieldCheck,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function InterpreterEarnings({ bookings, userData }: { bookings: any[], userData: any }) {
  const balance = userData?.interpreterData?.balance || 0;
  const totalMinutes = userData?.interpreterData?.totalMinutes || 0;
  const totalSessions = userData?.interpreterData?.totalSessions || 0;

  return (
    <div className="space-y-12">
      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass-dark p-10 rounded-[48px] border border-white/5 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 group-hover:bg-blue-500/20 transition-all duration-1000" />
          
          <div className="flex items-start justify-between mb-12">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <Wallet className="w-8 h-8 text-blue-500" />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 gradient-bg rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
              Request Payout <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div>
                <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">Available Balance</h2>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-black text-white italic tracking-tighter">${balance.toLocaleString()}</span>
                   <span className="text-blue-500 text-sm font-black italic">USD</span>
                </div>
             </div>
             
             <div className="flex flex-col justify-end">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 backdrop-blur-xl">
                   <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Performance Trend</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white italic">+{bookings.length}</span>
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Active Growth</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-12 flex items-center gap-6">
             <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500/80 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                <ShieldCheck className="w-3 h-3" />
                PROFESSIONAL WALLET VERIFIED
             </div>
          </div>
        </motion.div>

        {/* Stats Column */}
        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-dark p-8 rounded-[40px] border border-white/5 relative overflow-hidden group"
           >
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Clock className="w-5 h-5 text-green-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Service Time</p>
                    <h3 className="text-xl font-black text-white italic tracking-tight">{totalMinutes.toLocaleString()} MINS</h3>
                 </div>
              </div>
              <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Total linguistic impact delivered</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-dark p-8 rounded-[40px] border border-white/5 relative overflow-hidden group"
           >
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Experience</p>
                    <h3 className="text-xl font-black text-white italic tracking-tight">{totalSessions} SESSIONS</h3>
                 </div>
              </div>
              <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Successful professional partnerships</p>
           </motion.div>
        </div>
      </div>

      {/* Payout History / Payout Receipt Logs */}
      <div>
         <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-xl font-bold flex items-center gap-4 text-white">
               <History className="w-6 h-6 text-blue-500" />
               Earnings Records
            </h2>
            <div className="px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] italic">Audited Receipts</span>
            </div>
         </div>

         <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Receipt ref</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Client Name</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Duration</th>
                     <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Date Settled</th>
                     <th className="px-8 py-6 text-right text-[10px] font-black text-blue-500 uppercase tracking-widest">Net Earned</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {bookings.length > 0 ? bookings.map((booking: any) => (
                     <tr key={booking._id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                           <a 
                             href={`/dashboard/interpreter/invoice/${booking._id}`}
                             className="text-xs font-mono text-gray-500 hover:text-blue-500 transition-colors uppercase flex items-center gap-2 group/ref"
                           >
                              #{booking._id.slice(-8)}
                              <FileText className="w-3 h-3 opacity-0 group-hover/ref:opacity-100 transition-opacity" />
                           </a>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-white tracking-tight">{booking.clientId?.name || "Client Holder"}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">{booking.durationMinutes} min session</span>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-medium text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-sm font-black text-white italic tracking-tight">+${(booking.price || 0).toLocaleString()}</span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={5} className="px-8 py-32 text-center">
                           <Wallet className="w-12 h-12 text-white/5 mx-auto mb-4" />
                           <p className="text-gray-600 text-xs font-black uppercase tracking-widest italic">No earnings records found</p>
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
