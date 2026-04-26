"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  LayoutDashboard,
  UserCircle,
  Flag,
  Trash2,
  Lock,
  Unlock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { getPendingInterpreters, updateInterpreterStatus } from "@/app/actions/interpreter";
import { getAdminStats, getAllUsers, getAllSessions, updateUserAccountStatus } from "@/app/actions/admin";
import { getPlatformSettings, updatePlatformSetting } from "@/app/actions/adminSettings";
import { resolveReport } from "@/app/actions/reports";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [pending, setPending] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSessions: 0,
    interpretersCount: 0,
    clientsCount: 0
  });
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [settings, setSettings] = useState<any>({
    call_rate_per_minute: 0.75,
    platform_fee_percentage: 15,
    kyc_required: true
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const handleSignOut = async () => {
    try {
      setLogoutLoading(true);
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error) {
      toast.error("Failed to sign out");
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await getAdminStats();
      setStats(statsData);

      if (activeTab === 'KYC Verification') {
        const data = await getPendingInterpreters();
        setPending(data);
      } else if (activeTab === 'Interpreters') {
        const data = await getAllUsers("interpreter");
        setUsers(data);
      } else if (activeTab === 'Clients') {
        const data = await getAllUsers("client");
        setUsers(data);
      } else if (activeTab === 'Sessions') {
        const data = await getAllSessions();
        setSessions(data);
      } else if (activeTab === 'Reports') {
        const { getReports } = await import("@/app/actions/reports");
        const data = await getReports();
        setReports(data);
      } else if (activeTab === 'Settings') {
        const data = await getPlatformSettings();
        setSettings(data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, status: "verified" | "rejected") => {
    setProcessing(userId);
    const res = await updateInterpreterStatus(userId, status);
    if (res.success) {
      setPending(prev => prev.filter(u => u._id !== userId));
      toast.success(`User successfully ${status}`);
    } else {
      toast.error("Status update failed");
    }
    setProcessing(null);
  };

  const handleSaveSetting = async (key: string, value: any) => {
    setSavingSettings(true);
    const res = await updatePlatformSetting(key, value);
    if (res.success) {
      toast.success("Setting updated");
      setSettings((prev: any) => ({ ...prev, [key]: value }));
    } else {
      toast.error("Failed to update setting");
    }
    setSavingSettings(false);
  };

  const handleDeactivate = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    const res = await updateUserAccountStatus(userId, newStatus);
    if (res.success) {
      toast.success(`User ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } else {
      toast.error(res.error);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const res = await resolveReport(reportId, status);
    if (res.success) {
      toast.success(`Report ${status}`);
      setReports(reports.map(r => r._id === reportId ? { ...r, status } : r));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#010409] flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 pb-12">
          <Link href="/dashboard/admin" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminPanel</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview' },
            { icon: ShieldCheck, label: 'KYC Verification' },
            { icon: Users, label: 'Interpreters' },
            { icon: UserCircle, label: 'Clients' },
            { icon: FileText, label: 'Sessions' },
            { icon: Flag, label: 'Reports' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all ${activeTab === item.label ? "bg-red-600/10 text-red-500 border border-red-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button
            onClick={handleSignOut}
            disabled={logoutLoading}
            type="button"
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{logoutLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40 px-10 flex items-center justify-between">
          <h1 className="text-xl font-bold">{activeTab}</h1>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-white/5 transition-all text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">A</div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {activeTab === 'Overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'green' },
                  { label: 'Active Sessions', value: stats.activeSessions.toString(), color: 'blue' },
                  { label: 'Interpreters', value: stats.interpretersCount.toLocaleString(), color: 'purple' },
                  { label: 'Clients', value: stats.clientsCount.toLocaleString(), color: 'pink' },
                ].map(stat => (
                  <div key={stat.label} className="glass border border-white/5 p-6 rounded-3xl">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                    <h4 className="text-2xl font-extrabold">{stat.value}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'KYC Verification' && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold flex items-center gap-2">
                  Verification Queue
                  {pending.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pending.length} New</span>
                  )}
                </h2>
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
                            {item.interpreterData?.languages?.join(", ") || "No languages specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {processing === item._id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedUser(item)}
                              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-blue-400" />
                              Review Documents
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
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {(activeTab === 'Interpreters' || activeTab === 'Clients') && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold">{activeTab}</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {users.map(item => (
                    <div key={item._id} className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 font-bold text-lg">
                          {item.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-500 font-light">{item.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'deactivated' ? 'bg-red-500/10 text-red-500' : (item.interpreterData?.status === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500')
                          }`}>
                          {item.role} • {item.status === 'deactivated' ? 'Deactivated' : (item.interpreterData?.status || 'Active')}
                        </span>
                        <button
                          onClick={() => handleDeactivate(item._id, item.status || 'active')}
                          className={`p-2 rounded-xl transition-all ${item.status === 'deactivated' ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                          title={item.status === 'deactivated' ? "Activate Account" : "Deactivate Account"}
                        >
                          {item.status === 'deactivated' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Sessions' && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold">{activeTab}</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
                </div>
              ) : (
                <div className="overflow-x-auto glass rounded-3xl border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                        <th className="p-6">Room ID</th>
                        <th className="p-6">Client</th>
                        <th className="p-6">Interpreter</th>
                        <th className="p-6">Duration</th>
                        <th className="p-6">Rating</th>
                        <th className="p-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sessions.map(session => (
                        <tr key={session._id} className="text-sm hover:bg-white/[0.02] transition-colors">
                          <td className="p-6 font-mono text-xs text-blue-400">{session.roomId.slice(-8)}</td>
                          <td className="p-6">
                            <p className="font-bold">{session.clientId?.name || 'Deleted User'}</p>
                            <p className="text-[10px] text-gray-500">{session.clientId?.email || '-'}</p>
                          </td>
                          <td className="p-6">
                            <p className="font-bold">{session.interpreterId?.name || 'Deleted User'}</p>
                            <p className="text-[10px] text-gray-500">{session.interpreterId?.email || '-'}</p>
                          </td>
                          <td className="p-6 font-medium">{session.duration} mins</td>
                          <td className="p-6">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 font-bold">{session.rating}</span>
                              <span className="text-[10px] text-gray-500">/ 5</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sessions.length === 0 && (
                    <div className="p-20 text-center text-gray-500">No sessions found.</div>
                  )}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Reports' && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold">User Reports</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                  <Flag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">No reports found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {reports.map((report) => (
                    <div key={report._id} className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <Flag className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{report.reason}</h4>
                            <p className="text-sm text-gray-500">From: {report.reporterId?.name} ({report.reporterId?.role})</p>
                            <p className="text-sm text-red-500/70 font-medium">Against: {report.reportedUserId?.name} ({report.reportedUserId?.role})</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : report.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                            }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
                        <p className="text-gray-300 italic text-sm">"{report.description}"</p>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleResolveReport(report._id, 'resolved')}
                            className="px-6 py-2 rounded-xl bg-green-500/10 text-green-500 text-sm font-bold hover:bg-green-500 hover:text-white transition-all"
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleResolveReport(report._id, 'dismissed')}
                            className="px-6 py-2 rounded-xl bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 hover:text-white transition-all"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-4xl space-y-8">
              <section className="glass p-10 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-red-600 rounded-full" />
                  Financial Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Base Call Rate ($/min)</label>
                    <div className="flex gap-4">
                      <input 
                        type="number" 
                        value={settings.call_rate_per_minute} 
                        onChange={(e) => setSettings({...settings, call_rate_per_minute: parseFloat(e.target.value)})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-500/50 outline-none transition-all font-mono"
                      />
                      <button 
                        onClick={() => handleSaveSetting('call_rate_per_minute', settings.call_rate_per_minute)}
                        disabled={savingSettings}
                        className="px-6 rounded-2xl bg-white/5 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Platform Fee (%)</label>
                    <div className="flex gap-4">
                      <input 
                        type="number" 
                        value={settings.platform_fee_percentage} 
                        onChange={(e) => setSettings({...settings, platform_fee_percentage: parseFloat(e.target.value)})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-500/50 outline-none transition-all font-mono"
                      />
                      <button 
                        onClick={() => handleSaveSetting('platform_fee_percentage', settings.platform_fee_percentage)}
                        disabled={savingSettings}
                        className="px-6 rounded-2xl bg-white/5 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass p-10 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full" />
                  Compliance & Safety
                </h3>
                <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                  <div>
                    <h4 className="font-bold mb-1 text-sm">Require KYC for Interpreters</h4>
                    <p className="text-xs text-gray-500">Enable mandatory ID verification before interpreters can go online.</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('kyc_required', !settings.kyc_required)}
                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings.kyc_required ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.kyc_required ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </section>
            </div>
          )}
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
