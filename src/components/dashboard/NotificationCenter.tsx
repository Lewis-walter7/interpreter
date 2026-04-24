"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  X, 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  ExternalLink
} from "lucide-react";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from "@/app/actions/notifications";
import { pusherClient } from "@/lib/pusher-client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    if (!pusherClient) return;
    const channel = pusherClient.subscribe(`private-user-${userId}`);

    // Listen for real-time injections
    const handleNewBooking = (data: any) => {
        // We could fetch again or build the notification object locally
        fetchNotifications();
    };

    const handleUpdate = (data: any) => {
        fetchNotifications();
    };

    channel.bind("new-booking", handleNewBooking);
    channel.bind("booking-update", handleUpdate);

    return () => {
      pusherClient.unsubscribe(`private-user-${userId}`);
    };
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const data = await getNotifications(userId);
    setNotifications(data);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "booking_new": return <Calendar className="w-4 h-4 text-blue-500" />;
      case "booking_confirmed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "booking_cancelled": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all relative group"
      >
        <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-3 right-3 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#010409] text-[8px] font-black flex items-center justify-center text-white animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 mt-4 w-auto md:w-96 bg-[#0b0f1a] rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[500] overflow-hidden backdrop-blur-2xl top-24 md:top-auto"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Activity Feed</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-600">
                      <Bell className="w-6 h-6" />
                   </div>
                   <p className="text-gray-500 text-xs font-medium">No active notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id}
                    className={`p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors relative group ${!n.isRead ? 'bg-blue-500/[0.02]' : ''}`}
                  >
                    {!n.isRead && (
                      <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    )}
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                         {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-xs font-bold truncate ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-gray-600 font-medium shrink-0">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                          {n.message}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          {n.link && (
                            <Link 
                               href={n.link} 
                               className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                               onClick={() => {
                                 handleMarkAsRead(n._id);
                                 setIsOpen(false);
                               }}
                            >
                               View Details
                               <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                          {!n.isRead && (
                            <button 
                              onClick={() => handleMarkAsRead(n._id)}
                              className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>

                      <button 
                         onClick={() => handleDelete(n._id)}
                         className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-all absolute top-4 right-4"
                      >
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link 
               href="#" 
               className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
               View Full History
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
