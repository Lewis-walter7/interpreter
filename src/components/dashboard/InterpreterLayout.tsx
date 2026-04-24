"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
  Languages,
  ShieldCheck,
  Clock,
  Power,
  Wallet,
  Menu
} from "lucide-react";
import { signOut } from "next-auth/react";
import IncomingCall from "./IncomingCall";
import { toggleAvailability } from "@/app/actions/interpreter";
import { pusherClient } from "@/lib/pusher-client";
import { toast } from "react-hot-toast";
import NotificationCenter from "./NotificationCenter";
import { motion, AnimatePresence } from "framer-motion";

export default function InterpreterLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user: any
}) {
  const [isOnline, setIsOnline] = useState(user.interpreterData?.isOnline || false);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any | null>(null);
  const mounted = useRef(false);
  const callTimeoutRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    mounted.current = true;
    // Set online on mount
    toggleAvailability(true);

    // Tab close / Refresh protection
    const handleUnload = () => {
      toggleAvailability(false);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      mounted.current = false;
      window.removeEventListener("beforeunload", handleUnload);
      toggleAvailability(false);
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    };
  }, []);

  const toggleOnline = async () => {
    if (!mounted.current) return;
    setLoading(true);
    const res = await toggleAvailability(!isOnline);
    if (res.success && mounted.current) {
      setIsOnline(res.isOnline);
    }
    if (mounted.current) setLoading(false);
  };

  // Global Notification Listener
  useEffect(() => {
    if (!user || (!user.id && !user._id) || !pusherClient) return;
    const channel = pusherClient.subscribe(`private-user-${user.id || user._id}`);

    const handleNewBooking = (data: any) => {
      if (!mounted.current) return;
      toast.success(data.message || "New booking request!", {
        icon: '📅',
        style: { borderRadius: '16px', background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    };

    const handleIncomingCall = (data: any) => {
      if (!mounted.current) return;
      setIncomingCallData(data);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
      audio.play().catch(() => { });

      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = setTimeout(() => {
        if (mounted.current) setIncomingCallData(null);
      }, 30000);
    };

    channel.bind("new-booking", handleNewBooking);
    channel.bind("incoming-call", handleIncomingCall);

    return () => {
      pusherClient.unsubscribe(`private-user-${user.id || user._id}`);
    };
  }, [user?.id, user?._id]);

  const handleSignOut = async () => {
    await toggleAvailability(false);
    signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/interpreter" },
    { label: "Schedule", icon: Calendar, href: "/dashboard/interpreter/schedule" },
    { label: "Earnings", icon: Wallet, href: "/dashboard/interpreter/earnings" },
    { label: "Settings", icon: Settings, href: "/dashboard/interpreter/settings" },
  ];

  // Verified Status Logic
  const status = user.interpreterData?.status || "unverified";

  const STATUS_MAP = {
    verified: { icon: ShieldCheck, text: "Verified PRO", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    pending: { icon: Clock, text: "Review Pending", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    unverified: { icon: Settings, text: "Complete KYC", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" }
  };

  const statusConfig = STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.unverified;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-x-hidden">

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 border-r border-white/5 bg-[#010409] flex flex-col fixed inset-y-0 z-[110] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8">
          <Link href="/dashboard/interpreter" className="flex items-center gap-2">
            <div className="gradient-bg p-2 rounded-lg">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LinguistBridge</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                  ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Availability Toggle */}
        <div className="px-6 mb-4">
          <div className="glass-dark p-6 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] -z-10 transition-colors ${isOnline ? "bg-green-500/20" : "bg-red-500/10"}`} />

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Linguist Status</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span className={`text-xs font-bold ${isOnline ? "text-green-500" : "text-red-500"}`}>
                  {isOnline ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            </div>

            <button
              onClick={toggleOnline}
              disabled={loading}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black transition-all active:scale-95 ${isOnline
                ? "bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20"
                : "gradient-bg text-white shadow-lg shadow-blue-500/20"
                }`}
            >
              {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
              {isOnline ? "GO OFFLINE" : "GO ONLINE"}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="glass-dark p-4 rounded-2xl border border-white/5 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-72 min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-[100] px-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:relative sm:w-96 group sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search sessions..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Balance</p>
              <p className="text-lg font-black text-white">${(user?.interpreterData?.balance || 0).toLocaleString()}</p>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full ${statusConfig.bg} border ${statusConfig.border} ${statusConfig.color}`}>
              <statusConfig.icon className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">{statusConfig.text}</span>
            </div>

            <div className="flex items-center gap-2 md:gap-4 bg-white/5 p-1.5 md:p-2 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-xl">
              {/* Notifications & Calls */}
              <IncomingCall
                user={user}
                callData={incomingCallData}
                onClear={() => setIncomingCallData(null)}
              />
              <div className="md:hidden">
                <NotificationCenter userId={user.id || user._id} />
              </div>
              <div className="hidden md:block">
                <NotificationCenter userId={user.id || user._id} />
              </div>
              <div className="w-px h-6 md:h-8 bg-white/10 mx-1 md:mx-2" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
