"use client";

import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  ShieldCheck, 
  Users, 
  Search, 
  Bell, 
  Settings, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  FileText,
  ExternalLink,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { getPendingInterpreters, updateInterpreterStatus } from "@/app/actions/interpreter";

export default function AdminDashboard() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const data = await getPendingInterpreters();
    setPending(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (userId: string, status: "verified" | "rejected") => {
    setProcessing(userId);
    const res = await updateInterpreterStatus(userId, status);
    if (res.success) {
      setPending(prev => prev.filter(u => u._id !== userId));
    }
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#010409] flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminPanel</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {['Overview', 'KYC Verification', 'Interpreters', 'Clients', 'Sessions', 'Settings'].map((item) => (
            <button 
              key={item}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all ${
                item === 'KYC Verification' ? "bg-red-600/10 text-red-500 border border-red-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {item === 'Overview' && <Settings className="w-4 h-4" />}
                {item === 'KYC Verification' && <ShieldCheck className="w-4 h-4" />}
                {item === 'Interpreters' && <Users className="w-4 h-4" />}
                {item === 'Settings' && <Settings className="w-4 h-4" />}
              </div>
              <span className="font-medium text-sm">{item}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40 px-10 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Overview</h1>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-white/5 transition-all text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* KYC Queue */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold flex items-center gap-2">
                Verification Queue
                {pending.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pending.length} New</span>
                )}
              </h2>
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
              </div>
            ) : pending.length === 0 ? (
              <div className="glass-dark p-12 rounded-3xl border border-white/5 text-center">
                <p className="text-gray-500 font-light">No pending verifications at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pending.map(item => (
                  <div key={item._id} className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 font-bold text-lg">
                        {item.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-light">
                          {item.interpreterData?.languages?.join(", ") || "No languages specified"} • {item.interpreterData?.specialization || "General"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {processing === item._id ? (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      ) : (
                        <>
                          <button 
                            onClick={() => setSelectedUser(item)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4 text-blue-400" />
                            View KYC Files ({item.interpreterData?.kycFiles?.length || 0})
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item._id, "rejected")}
                            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item._id, "verified")}
                            className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 transition-all hover:text-white"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 group-hover:hidden">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: '$45,280', color: 'green' },
              { label: 'Active Sessions', value: '12', color: 'blue' },
              { label: 'Interpreters', value: '1,204', color: 'purple' },
              { label: 'Clients', value: '8,432', color: 'pink' },
            ].map(stat => (
              <div key={stat.label} className="glass border border-white/5 p-6 rounded-3xl">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-2xl font-extrabold">{stat.value}</h4>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* KYC Files Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#010409] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Verify Documents</h3>
                  <p className="text-sm text-gray-500">Reviewing files for <span className="text-blue-400 font-bold">{selectedUser.name}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {selectedUser.interpreterData?.kycFiles?.map((file: any, idx: number) => (
                    <div key={idx} className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm mb-0.5">{file.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">{file.category || "Verification ID"}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-all font-bold">
                        <ExternalLink className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Please ensure that the name on the ID matches the user's profile name. Certification files should be valid and issued by a recognized authority.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
                <button 
                  onClick={() => {
                    handleStatusUpdate(selectedUser._id, "rejected");
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Reject Application
                </button>
                <button 
                  onClick={() => {
                    handleStatusUpdate(selectedUser._id, "verified");
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-4 rounded-2xl gradient-bg text-white font-bold shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all"
                >
                  Verify & Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
