"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Video,
  Star,
  Globe,
  Search,
  Filter,
  ShieldCheck,
  MessageSquare,
  Power,
  Loader2,
  Languages,
  Calendar,
  ArrowRight
} from "lucide-react";
import { getOnlineInterpreters } from "@/app/actions/marketplace";
import { initiateCall } from "@/app/actions/calls";
import { pusherClient } from "@/lib/pusher-client";
import { useRouter } from "next/navigation";
import BookingModal from "./BookingModal";

export default function MarketplaceGrid({ currentUser }: { currentUser: any }) {
  const router = useRouter();
  const [interpreters, setInterpreters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedForBooking, setSelectedForBooking] = useState<any>(null);

  useEffect(() => {
    fetchInterpreters();
    if (!pusherClient) return;

    // Subscribe to real-time status updates
    const channel = pusherClient.subscribe("marketplace");

    channel.bind("status-update", (data: any) => {
      // Refresh the list when someone goes online/offline
      fetchInterpreters();
    });

    return () => {
      if (pusherClient) pusherClient.unsubscribe("marketplace");
    };
  }, [pusherClient]);

  const fetchInterpreters = async () => {
    const res = await getOnlineInterpreters();
    if (res.success) {
      setInterpreters(res.interpreters);
    }
    setLoading(false);
  };
  
  const openBooking = (interpreter: any) => {
    setSelectedForBooking(interpreter);
    setIsBookingOpen(true);
  };

  const handleCall = async (interpreter: any) => {
    setCallingId(interpreter._id);
    const roomId = `room_${Math.random().toString(36).substring(7)}`;

    const callTimeout = setTimeout(() => {
      setCallingId(null);
      pusherClient.unsubscribe(`private-user-${currentUser.id || currentUser._id}`);
      alert("No response from interpreter. Please try another linguist.");
    }, 15000);

    // Listen for the interpreter's response to THIS specific room
    const channel = pusherClient.subscribe(`private-user-${currentUser.id || currentUser._id}`);
    channel.bind("call-response", (data: any) => {
      clearTimeout(callTimeout); // Stop the timer if they respond
      if (data.accepted && data.roomId === roomId) {
        router.push(`/session/${roomId}?i=${interpreter._id}`);
      } else {
        setCallingId(null);
        alert("Interpreter is busy or declined the call.");
      }
      pusherClient.unsubscribe(`private-user-${currentUser.id || currentUser._id}`);
    });

    await initiateCall(interpreter._id, currentUser.name, currentUser.id || currentUser._id, roomId);
  };

  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerLoad = 10;

  const filteredInterpreters = interpreters.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.interpreterData?.languages?.some((l: string) => l.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    setVisibleCount(10);
  }, [search]);

  const hasMore = visibleCount < filteredInterpreters.length;
  const paginatedInterpreters = filteredInterpreters.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Available Linguists
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </h2>
          <p className="text-gray-500 text-sm font-medium">Verified experts ready for immediate connection.</p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search language or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-[40px] bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedInterpreters.map((interpreter) => (
                <motion.div
                  key={interpreter._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-dark rounded-[40px] border border-white/5 p-8 group hover:border-blue-500/30 transition-all relative overflow-hidden h-full flex flex-col shadow-2xl"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-all" />

                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                      {interpreter.name.charAt(0)}
                    </div>
                    <div className="flex h-fit bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Now</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{interpreter.name}</h3>
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-white tracking-tighter">{interpreter.interpreterData?.rating || 5.0}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>{interpreter.interpreterData?.totalReviews || 0} reviews</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Languages className="w-4 h-4 text-blue-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interpreter.interpreterData?.languages?.length > 0 ? (
                          interpreter.interpreterData.languages.map((lang: string, i: number) => (
                            <span 
                              key={i} 
                              className="px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] font-bold text-blue-400 capitalize hover:bg-blue-500/20 transition-colors"
                            >
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-gray-600 italic">No languages listed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleCall(interpreter)}
                      disabled={callingId !== null}
                      className="w-full gradient-bg py-5 rounded-2xl text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {callingId === interpreter._id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Video className="w-5 h-5" />
                          Immediate Call
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openBooking(interpreter)}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-blue-500" />
                      SCHEDULE SESSION
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                onClick={() => setVisibleCount(v => v + itemsPerLoad)}
                className="group relative px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-blue-500/50 transition-all flex items-center gap-3 overflow-hidden shadow-2xl shadow-blue-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Users className="w-4 h-4 text-blue-500" />
                <span>Load More Experts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}

      {selectedForBooking && (
        <BookingModal 
           isOpen={isBookingOpen}
           onClose={() => setIsBookingOpen(false)}
           interpreter={selectedForBooking}
           currentUser={currentUser}
        />
      )}
    </div>
  );
}
