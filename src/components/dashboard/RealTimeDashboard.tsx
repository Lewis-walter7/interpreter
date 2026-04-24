"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Power,
  Settings,
  MessageSquare,
  Video,
  Clock,
  Star,
  Users,
  TrendingUp,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import { toggleAvailability } from "@/app/actions/interpreter";

export default function RealTimeDashboard({ 
  user, 
  initialCalls = [] 
}: { 
  user: any, 
  initialCalls?: any[] 
}) {
  const [isOnline, setIsOnline] = useState(user.interpreterData?.isOnline || false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialCalls);

  // Real-time stats state
  const [stats, setStats] = useState({
    rating: user.interpreterData?.rating || 5,
    totalMinutes: user.interpreterData?.totalMinutes || 0,
    totalSessions: user.interpreterData?.totalSessions || 0,
    totalReviews: user.interpreterData?.totalReviews || 0
  });

  // Sync state with fresh prop data (especially important after returns from session)
  React.useEffect(() => {
    if (user.interpreterData) {
      setIsOnline(user.interpreterData.isOnline);
      setStats({
        rating: user.interpreterData.rating,
        totalMinutes: user.interpreterData.totalMinutes,
        totalSessions: user.interpreterData.totalSessions,
        totalReviews: user.interpreterData.totalReviews
      });
    }
    if (initialCalls) {
      setHistory(initialCalls);
    }
  }, [user.interpreterData, initialCalls]);

  // Real-time Background Updates
  React.useEffect(() => {
    if (!user.id && !user._id) return;

    const channel = pusherClient.subscribe(`private-user-${user.id || user._id}`);
    
    channel.bind("stats-update", (data: any) => {
      setStats({
        rating: data.rating,
        totalMinutes: data.totalMinutes,
        totalSessions: data.totalSessions,
        totalReviews: data.totalReviews
      });
      // Optionally re-fetch history if we want to be hyper-reactive, 
      // but usually the refresh on returning to dash handles it.
    });

    return () => {
      pusherClient.unsubscribe(`private-user-${user.id || user._id}`);
    };
  }, [user.id, user._id]);


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Stat & Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Minutes</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {stats.totalMinutes.toLocaleString() || 0}
          </h3>
        </div>

        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              {stats.totalReviews} reviews
            </span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Avg Rating</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {stats.rating.toFixed(1)}
          </h3>
        </div>

        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-500 font-light tracking-tight">Total History</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Sessions</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {stats.totalSessions}
          </h3>
        </div>

        {/* Live Queue Integrated */}
        <div className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
           <div className="flex justify-between items-center mb-4">
             <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
               <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-700"}`} />
             </div>
             <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Live Status</span>
           </div>
           <div>
             <p className="text-gray-400 text-sm font-medium">Call Queue</p>
             <p className="text-white text-sm font-bold mt-1">
               {isOnline ? "Awaiting Requests" : "Connection Offline"}
             </p>
           </div>
        </div>
      </div>

      {/* Call History Section */}
      <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
           <h2 className="text-xl font-black text-white flex items-center gap-3">
             <LayoutDashboard className="w-6 h-6 text-blue-500" />
             Recent Session History
           </h2>
           <button className="text-xs font-black uppercase text-blue-500 tracking-widest hover:text-white transition-colors">
             Export CSV
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Duration</th>
                <th className="px-8 py-6">Service</th>
                <th className="px-8 py-6">Rating</th>
                <th className="px-8 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((job, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-white">
                    {new Date(job.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400 font-mono">{job.duration}m</td>
                  <td className="px-8 py-6 text-sm text-gray-400">{job.serviceType || "Video Call"}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 py-1 px-3 bg-yellow-500/10 rounded-full w-fit">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-yellow-500">{job.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 capitalize">
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {history.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No session history yet</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto font-light">Your completed calls and earnings summaries will appear here once you start taking jobs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
