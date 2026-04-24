"use client";

import React, { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Search, Users, Settings, Bell, CreditCard, Video, Calendar, Clock } from "lucide-react";
import { signOut } from "next-auth/react";
import MarketplaceGrid from "./MarketplaceGrid";
import { toggleAvailability } from "@/app/actions/interpreter";
import { pusherClient } from "@/lib/pusher-client";
import { toast } from "react-hot-toast";
import NotificationCenter from "./NotificationCenter";
import Link from "next/link";

export default function ClientDashboard({ user, initialBookings = [] }: { user: any, initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const userId = String(user?.id || user?._id || "");

  useEffect(() => {
    if (!userId || userId === "undefined") return;
    const currentUserId = userId;
    const channel = pusherClient.subscribe(`private-user-${currentUserId}`);

    channel.bind("booking-update", (data: any) => {
      setBookings(prev => prev.map(b => b._id === data.bookingId ? { ...b, status: data.status } : b));
      
      toast.success(data.message || "Your booking status has been updated!", {
        icon: data.status === 'confirmed' ? '✅' : '❌',
        style: { borderRadius: '16px', background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    });

    return () => {
      pusherClient.unsubscribe(`private-user-${currentUserId}`);
    };
  }, [userId]);

  const handleSignOut = async () => {
    await toggleAvailability(false);
    signOut({ callbackUrl: "/" });
  };

  const confirmedBookings = bookings.filter(b => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative z-[100]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Client Portal</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight italic">
              Hello, {user.name.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
             <NotificationCenter userId={userId} />
             <button className="p-3 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <CreditCard className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 pl-4 pr-6 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="space-y-12">
          {/* Dashboard Stats / Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Confirmed Calls", value: confirmedBookings.length.toString(), icon: Video, color: "text-blue-500" },
              { label: "Total Bookings", value: bookings.length.toString(), icon: Users, color: "text-purple-500" },
              { label: "Account Balance", value: "$0.00", icon: CreditCard, color: "text-green-500" }
            ].map((stat, i) => (
              <div key={i} className="glass-dark p-6 rounded-[32px] border border-white/5 flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active / Upcoming Sessions */}
          {confirmedBookings.length > 0 && (
            <div className="glass-dark p-8 rounded-[40px] border border-white/5 bg-blue-500/5">
               <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
                  <Clock className="w-6 h-6 text-blue-500" />
                  Your Sessions
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {confirmedBookings.map((booking: any) => (
                    <div key={booking._id} className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                             {booking.interpreterId?.image ? (
                                <img src={booking.interpreterId.image} className="w-full h-full object-cover rounded-2xl" alt="" />
                             ) : (
                                <Users className="w-6 h-6 text-blue-500" />
                             )}
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm tracking-tight">{booking.interpreterId?.name || "Interpreter"}</p>
                             <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                          </div>
                       </div>

                       {booking.status === "completed" ? (
                          <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             Completed
                          </span>
                       ) : new Date(booking.startTime).getTime() - Date.now() < 10 * 60 * 1000 && 
                        new Date(booking.startTime).getTime() - Date.now() > -30 * 60 * 1000 ? (
                          <Link 
                             href={`/session/${booking._id}`}
                             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 animate-pulse"
                          >
                             <Video className="w-4 h-4" />
                             JOIN NOW
                          </Link>
                       ) : (
                          <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                             Scheduled
                          </span>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* THE MARKETPLACE */}
          <div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
               <Search className="w-6 h-6 text-blue-500" />
               Linguist Marketplace
            </h2>
            <MarketplaceGrid currentUser={{
              id: user._id || user.id,
              name: user.name
            }} />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-[0.2em] italic">LinguistBridge © 2026 — Secure Translation Network</p>
          <div className="flex gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
