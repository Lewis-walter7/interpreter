"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  MessageSquare,
  AlertCircle,
  Loader2,
  Video
} from "lucide-react";
import { updateBookingStatus } from "@/app/actions/booking";
import { pusherClient } from "@/lib/pusher-client";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ScheduleManager({ 
  initialBookings, 
  interpreterId 
}: { 
  initialBookings: any[], 
  interpreterId: string 
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe(`private-user-${interpreterId}`);
    
    channel.bind("new-booking", (data: any) => {
      if (data.booking) {
        setBookings(prev => {
          // Prevent duplicates
          if (prev.some(b => b._id === data.booking._id)) return prev;
          return [data.booking, ...prev];
        });
        toast.success("New booking request received!", {
           icon: '📅',
           style: { borderRadius: '16px', background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        });
      }
    });

    channel.bind("booking-update", (data: any) => {
      setBookings(prev => prev.map(b => 
        b._id === data.bookingId ? { ...b, status: data.status } : b
      ));
    });

    return () => {
      pusherClient.unsubscribe(`private-user-${interpreterId}`);
    };
  }, [interpreterId]);

  const handleUpdateStatus = async (bookingId: string, status: "confirmed" | "cancelled") => {
    setProcessingId(bookingId);
    const res = await updateBookingStatus(bookingId, status);
    if (res.success) {
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
      toast.success(`Booking ${status} successfully!`);
    } else {
      toast.error("Failed to update booking.");
    }
    setProcessingId(null);
  };

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Pending Requests */}
        <div className="glass-dark p-8 rounded-[40px] border border-white/5 bg-yellow-500/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              Pending Requests
              <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingBookings.length}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                <p className="text-gray-500 text-sm font-medium">No pending requests at the moment</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div key={booking._id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between gap-6 group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-xl font-black">
                      {booking.clientId?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{booking.clientId?.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.startTime).toLocaleDateString('en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <button 
                       onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                       disabled={processingId === booking._id}
                       className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/10"
                     >
                       <XCircle className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                       disabled={processingId === booking._id}
                       className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                     >
                       {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                       CONFIRM
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirmed Schedule */}
        <div className="glass-dark p-8 rounded-[40px] border border-white/5">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
             <CheckCircle2 className="w-6 h-6 text-blue-500" />
             Confirmed Sessions
          </h2>
          
          <div className="space-y-4">
            {confirmedBookings.length === 0 ? (
               <p className="text-gray-500 text-sm italic font-light">Your confirmed schedule will appear here.</p>
            ) : (
              confirmedBookings.map((booking) => (
                <div key={booking._id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                       <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-white font-bold text-sm truncate">{booking.clientId?.name}</p>
                       <p className="text-gray-500 text-xs font-mono">
                          {new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     {booking.status === "completed" ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                           <CheckCircle2 className="w-3 h-3 text-gray-500" />
                           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Completed</span>
                        </div>
                     ) : (new Date(booking.startTime).getTime() - Date.now() < 10 * 60 * 1000 && 
                      new Date(booking.startTime).getTime() - Date.now() > -30 * 60 * 1000) ? (
                        <Link 
                           href={`/session/${booking._id}`}
                           className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 animate-pulse border border-blue-400/30"
                        >
                           <Video className="w-3.5 h-3.5" />
                           JOIN SESSION
                        </Link>
                     ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Scheduled</span>
                        </div>
                     )}
                     
                     <button 
                        onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                        disabled={processingId === booking._id}
                        className="p-2 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Cancel Session"
                     >
                        {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats & Actions Sidebar */}
      <div className="space-y-6">
         <div className="glass-dark p-8 rounded-[40px] border border-white/5 bg-blue-600/5">
            <h3 className="text-white font-bold text-lg mb-4">Availability Summary</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <span className="text-xs text-gray-500">Total Confirmed</span>
                  <span className="text-sm font-black text-white">{confirmedBookings.length}</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <span className="text-xs text-gray-500">Hours Booked</span>
                  <span className="text-sm font-black text-blue-500">{confirmedBookings.length * 1} hrs</span>
               </div>
            </div>
         </div>

         <div className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-blue-500/20">
            <h3 className="text-white font-bold mb-2">Live Support</h3>
            <p className="text-gray-400 text-xs mb-6 font-light leading-relaxed">
               Need to reschedule? Our support team can assist with client communication.
            </p>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2">
               <MessageSquare className="w-4 h-4" />
               CONTACT SUPPORT
            </button>
         </div>
      </div>
    </div>
  );
}
