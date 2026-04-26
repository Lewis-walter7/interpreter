"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Languages, 
  Clock,
  History,
  ShieldCheck,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./NotificationCenter";
import { toast } from "react-hot-toast";

export default function ClientLayout({ children, user }: { children: React.ReactNode, user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Marketplace", href: "/dashboard/client" },
    { icon: History, label: "Call History", href: "/dashboard/client/history" },
    { icon: CreditCard, label: "Billing & Spent", href: "/dashboard/client/billing" },
    { icon: Settings, label: "Account Settings", href: "/dashboard/client/settings" },
  ];

  const handleSignOut = async () => {
    try {
      setLogoutLoading(true);
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error) {
      toast.error("Failed to sign out");
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full h-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-[120] px-6 flex items-center justify-between">
        <Link href="/dashboard/client" className="flex items-center gap-2">
          <div className="gradient-bg p-2 rounded-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white tracking-widest text-sm italic">LB.CLIENT</span>
        </Link>
        <div className="flex items-center gap-4">
          <NotificationCenter userId={user.id || user._id} />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-400 hover:text-white transition-all">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`w-72 border-r border-white/5 bg-[#010409] flex flex-col fixed inset-y-0 z-[110] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8">
          <Link href="/dashboard/client" className="flex items-center gap-2">
            <div className="gradient-bg p-2 rounded-lg">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-widest text-xl italic">LB.CLIENT</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                  isActive 
                  ? "bg-blue-600/10 text-blue-500 border border-blue-500/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-500" : "text-gray-500 group-hover:text-white"}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="glass-dark p-6 rounded-[32px] border border-white/5 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Profile Type</p>
                <p className="text-xs font-bold text-white">Client Portal</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={logoutLoading}
              type="button"
              className="w-full py-3 rounded-xl bg-red-500/5 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/10 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {logoutLoading ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
          
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 rounded-xl gradient-bg p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#010409] flex items-center justify-center font-black text-white text-xs">
                   {user.name.charAt(0)}
                </div>
             </div>
             <div>
                <p className="text-xs font-bold text-white leading-none mb-1">{user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-600 font-medium">Standard Plan</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 md:ml-72 min-h-screen relative">
        {/* Desktop Topbar */}
        <div className="hidden md:flex h-24 items-center justify-between px-12 sticky top-0 bg-[#020617]/50 backdrop-blur-xl z-40 border-b border-white/5">
           <div>
              <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-1 italic">LinguistBridge</h2>
              <p className="text-sm font-medium text-gray-500">Welcome back to your workspace</p>
           </div>
           <div className="flex items-center gap-6">
              <NotificationCenter userId={user.id || user._id} />
              <div className="w-px h-8 bg-white/10" />
              <Link href="/dashboard/client/settings" className="flex items-center gap-3 group">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all border border-white/5">
                    <Settings className="w-5 h-5" />
                 </div>
              </Link>
           </div>
        </div>

        <div className="p-6 md:p-12 pt-28 md:pt-12">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
