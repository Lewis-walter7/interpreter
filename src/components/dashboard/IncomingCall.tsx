"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { respondToCall } from "@/app/actions/calls";

interface IncomingCallProps {
  user: any;
  callData: any | null;
  onClear: () => void;
}

export default function IncomingCall({ user, callData, onClear }: IncomingCallProps) {
  const router = useRouter();

  const handleAccept = async () => {
    if (!callData) return;
    
    // Notify the client that we accepted
    await respondToCall(callData.roomId, true, callData.callerId);
    
    router.push(`/session/${callData.roomId}`);
    onClear();
  };

  const handleDecline = async () => {
    if (!callData) return;
    await respondToCall(callData.roomId, false, callData.callerId);
    onClear();
  };

  return (
    <AnimatePresence>
      {callData && (
        <div className="fixed top-6 right-6 z-[200] w-96">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="glass-dark border border-blue-500/30 rounded-[32px] p-1 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] overflow-hidden"
          >
            <div className="bg-[#020617]/80 backdrop-blur-xl p-6 rounded-[28px]">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <User className="w-8 h-8" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#020617]" 
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Incoming Call</p>
                  <h4 className="text-xl font-black text-white">{callData.callerName || "Unknown Client"}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-6 text-gray-500 italic text-xs leading-relaxed">
                <Bell className="w-4 h-4 shrink-0 text-blue-500" />
                "I need urgent assistance from a linguistic expert."
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleDecline}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 font-bold transition-all"
                >
                  <PhoneOff className="w-5 h-5" />
                  Decline
                </button>
                <button 
                  onClick={handleAccept}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl gradient-bg text-white font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
