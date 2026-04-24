"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  Search, 
  Filter,
  ArrowRight,
  TrendingUp,
  XCircle,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CallHistory({ initialBookings, userId }: { initialBookings: any[], userId: string }) {
  const [filter, setFilter] = useState("all");
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);

  useEffect(() => {
    const updatePerPage = () => {
      setSessionsPerPage(window.innerWidth < 768 ? 3 : 10);
    };
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  const filteredBookings = initialBookings.filter((b: any) => {
    if (filter === "all") return true;
    if (filter === "scheduled") return b.status === "confirmed" || b.status === "pending";
    return b.status === filter;
  });

  const totalPages = Math.ceil(filteredBookings.length / sessionsPerPage);
  const paginatedSessions = filteredBookings.slice(
    (sessionPage - 1) * sessionsPerPage,
    sessionPage * sessionsPerPage
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-4 rounded-[32px] border border-white/5">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Calls", icon: History },
            { id: "completed", label: "Completed", icon: CheckCircle2 },
            { id: "scheduled", label: "Scheduled", icon: Calendar },
            { id: "cancelled", label: "Cancelled", icon: XCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilter(tab.id); setSessionPage(1); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab.id 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mr-3">Summary:</span>
           <span className="text-sm font-bold text-white">{filteredBookings.length} {filter} Items</span>
        </div>
      </div>

      {/* History Grid */}
      {paginatedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
            {paginatedSessions.map((booking: any) => (
              <motion.div
                key={booking._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-dark p-8 rounded-[40px] border border-white/5 group hover:border-blue-500/30 transition-all flex flex-col h-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] -z-10 group-hover:bg-blue-500/10 transition-all" />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-bg p-0.5 shadow-lg shadow-blue-500/20">
                     <div className="w-full h-full rounded-[15px] bg-[#020617] overflow-hidden">
                        {booking.interpreterId?.image ? (
                           <img src={booking.interpreterId.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center font-black text-white text-xl uppercase italic">
                              {booking.interpreterId?.name?.charAt(0) || "L"}
                           </div>
                        )}
                     </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                    booking.status === "completed" 
                    ? "bg-green-500/10 border-green-500/20 text-green-500" 
                    : booking.status === "cancelled"
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  }`}>
                    {booking.status}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{booking.interpreterId?.name || "Linguist Expert"}</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                       <Calendar className="w-4 h-4 text-gray-600" />
                       <span className="text-gray-400 text-sm font-medium">{new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Clock className="w-4 h-4 text-gray-600" />
                       <span className="text-gray-400 text-sm font-medium">{new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   {booking.status === "confirmed" ? (
                      <Link 
                        href={`/session/${booking._id}`}
                        className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
                      >
                         <Video className="w-4 h-4" />
                         Join Session
                      </Link>
                   ) : (
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Reference: {booking._id.slice(-6)}</span>
                         <button className="text-[10px] font-black text-blue-500 hover:scale-110 transition-transform">DETAILS <ArrowRight className="inline w-3 h-3" /></button>
                      </div>
                   )}
                </div>
              </motion.div>
            ))}
           </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center bg-white/[0.02] rounded-[60px] border border-white/5 border-dashed">
           <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
              <History className="w-10 h-10 animate-pulse" />
           </div>
           <h3 className="text-2xl font-bold text-white mb-2 italic">Nothing to see here yet</h3>
           <p className="text-gray-500 font-medium text-sm">No historical records match your current filter.</p>
        </div>
      )}

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-24 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl w-fit mx-auto">
          <button
            onClick={() => setSessionPage(p => Math.max(1, p - 1))}
            disabled={sessionPage === 1}
            className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
          >
            <Clock className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSessionPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                  sessionPage === i + 1 
                  ? "gradient-bg text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSessionPage(p => Math.min(totalPages, p + 1))}
            disabled={sessionPage === totalPages}
            className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
