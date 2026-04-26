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
  CheckCircle2,
  Flag,
  Loader2,
  AlertCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function CallHistory({ 
  initialBookings, 
  userId,
  userRole 
}: { 
  initialBookings: any[], 
  userId: string,
  userRole: string 
}) {
  const [filter, setFilter] = useState("all");
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);

  // Reporting State
  const [reportingItem, setReportingItem] = useState<any>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                layout
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-dark p-10 rounded-[48px] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-gray-400 font-bold text-xl border border-white/5 group-hover:scale-110 transition-transform">
                        {(userRole === 'client' ? booking.interpreterId?.name : booking.clientId?.name)?.[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-1 italic">
                          {userRole === 'client' ? booking.interpreterId?.name : booking.clientId?.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${booking.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
                          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{booking.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-400 text-sm font-medium">
                        {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-400 text-sm font-medium">
                        {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {booking.duration > 0 && (
                      <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-blue-500/50" />
                        <span className="text-blue-500/80 text-sm font-bold italic">
                          {Math.floor(booking.duration / 60)}m {booking.duration % 60}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
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
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setReportingItem(booking)}
                          className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Report Issue"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        <button type="button" className="text-[10px] font-black text-blue-500 hover:scale-110 transition-transform">
                          DETAILS <ArrowRight className="inline w-3 h-3" />
                        </button>
                      </div>
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

      {/* Report Modal */}
      <AnimatePresence>
        {reportingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Report Issue</h3>
                  <p className="text-sm text-gray-500">Let us know what went wrong.</p>
                </div>
                <button onClick={() => setReportingItem(null)} className="p-3 rounded-2xl hover:bg-white/5 transition-all text-gray-500">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form className="p-8 space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const { submitReport } = await import("@/app/actions/reports");
                  const reportedUserId = userRole === 'client' 
                    ? reportingItem.interpreterId?._id || reportingItem.interpreterId 
                    : reportingItem.clientId?._id || reportingItem.clientId;
                  
                  const res = await submitReport({
                    reportedUserId,
                    callId: reportingItem._id,
                    reason: reportReason,
                    description: reportDescription
                  });

                  if (res.success) {
                    toast.success("Report submitted successfully");
                    setReportingItem(null);
                    setReportReason("");
                    setReportDescription("");
                  } else {
                    toast.error(res.error);
                  }
                } catch (err) {
                  toast.error("Failed to submit report");
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Reason</label>
                  <select 
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500/50 appearance-none"
                  >
                    <option value="" disabled className="bg-[#0a0f1d]">Select a reason</option>
                    <option value="Unprofessional behavior" className="bg-[#0a0f1d]">Unprofessional behavior</option>
                    <option value="Technical issues" className="bg-[#0a0f1d]">Technical issues</option>
                    <option value="No show" className="bg-[#0a0f1d]">No show</option>
                    <option value="Inaccurate interpretation" className="bg-[#0a0f1d]">Inaccurate interpretation</option>
                    <option value="Other" className="bg-[#0a0f1d]">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Description</label>
                  <textarea
                    required
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Please provide more details..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
                  Submit Report
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
