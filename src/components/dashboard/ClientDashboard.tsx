"use client";

import React, { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Search, Users, Settings, Bell, CreditCard, Video, Calendar, Clock, ArrowRight } from "lucide-react";
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

  const [sessionsPerPage, setSessionsPerPage] = useState(10);
  const [sessionPage, setSessionPage] = useState(1);

  useEffect(() => {
    const updatePerPage = () => {
      setSessionsPerPage(window.innerWidth < 768 ? 3 : 10);
    };
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  const sortedBookings = [...bookings].sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const totalSessionPages = Math.ceil(sortedBookings.length / sessionsPerPage);
  const paginatedSessions = sortedBookings.slice(
    (sessionPage - 1) * sessionsPerPage,
    sessionPage * sessionsPerPage
  );

  const handleSignOut = async () => {
    await toggleAvailability(false);
    signOut({ callbackUrl: "/" });
  };

  const confirmedBookingsCount = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Dashboard Stats / Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Confirmed Calls", value: confirmedBookingsCount.toString(), icon: Video, color: "text-blue-500" },
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

      {/* Upcoming Schedule - Full Width Command Center */}
      <div className="glass-dark p-8 md:p-12 rounded-[40px] border border-white/5 bg-blue-500/5 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -z-10 group-hover:bg-blue-500/10 transition-all duration-1000" />

        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-black flex items-center gap-3 text-white tracking-tight italic">
              <Calendar className="w-8 h-8 text-blue-500" />
              Your Active Schedule
            </h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest pl-11">Immediate and upcoming connection roadmap</p>
          </div>
          <Link href="/dashboard/client/history" className="group/btn px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 border border-white/5">
            Full Archives
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        {bookings.filter(b => b.status === "confirmed" || b.status === "pending").length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings
              .filter(b => b.status === "confirmed" || b.status === "pending")
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .slice(0, 8) // Show more now that it's full width
              .map((booking: any) => (
                <div key={booking._id} className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 flex flex-col justify-between group/item hover:border-blue-500/30 transition-all h-full relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/[0.02] opacity-0 group-hover/item:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/5 overflow-hidden shadow-inner">
                        {booking.interpreterId?.image ? (
                          <img src={booking.interpreterId.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Users className="w-7 h-7 text-blue-500" />
                        )}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${booking.status === "confirmed"
                          ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                        }`}>
                        {booking.status === "confirmed" ? "READY" : "WAITING"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 tracking-tight">{booking.interpreterId?.name || "Linguist Expert"}</h3>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
                        <Calendar className="w-4 h-4 text-blue-500/50" />
                        {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
                        <Clock className="w-4 h-4 text-blue-500/50" />
                        {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-white/5">
                    {new Date(booking.startTime).getTime() - Date.now() < 10 * 60 * 1000 &&
                      new Date(booking.startTime).getTime() - Date.now() > -30 * 60 * 1000 ? (
                      <Link
                        href={`/session/${booking._id}`}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-2xl shadow-xl shadow-blue-500/40 transition-all flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Video className="w-4 h-4" />
                        ENTER CALL NOW
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        <span>Linguist Expert</span>
                        <span className={booking.status === "confirmed" ? "text-green-500/50" : "text-yellow-500/50"}>
                          {booking.status === "confirmed" ? "Approved" : "Verifying"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="h-64 bg-white/[0.02] rounded-[40px] border border-white/5 border-dashed flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Your schedule is clear</p>
              <p className="text-gray-600 text-[10px] font-medium">Ready to discover your next linguistic partner?</p>
            </div>
            <button className="px-8 py-3 bg-blue-600/10 text-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all">BOOK NOW</button>
          </div>
        )}
      </div>

      {/* THE MARKETPLACE AREA */}
      <div>
        <div className="flex items-center justify-between mb-10 px-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-black flex items-center gap-4 text-white italic tracking-tighter">
              <Search className="w-10 h-10 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              Linguist Discovery
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] pl-14">The World's Elite Translation Network</p>
          </div>
        </div>

        <MarketplaceGrid currentUser={{
          id: user._id || user.id,
          name: user.name
        }} />
      </div>
    </div>
  );
}
