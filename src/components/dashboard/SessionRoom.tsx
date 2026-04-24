"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  Settings,
  MoreVertical,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SessionRoom({ roomId, user }: { roomId: string, user: any }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Real WebRTC refs would go here
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="fixed inset-0 bg-[#010409] z-[100] flex flex-col">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-white tracking-widest uppercase">Live Session: {roomId}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            Secure P2P Encryption Active
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center p-6 gap-6">
          {/* Remote Video (Client) */}
          <div className="flex-1 h-full rounded-3xl overflow-hidden bg-zinc-900 relative group border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-gray-700">
              <Users className="w-20 h-20 opacity-20" />
            </div>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 block bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm font-medium">
              Client: John Doe
            </div>
          </div>

          {/* Local Video (Interpreter) - Picture in Picture style */}
          <div className="absolute bottom-10 right-10 w-64 aspect-video rounded-2xl overflow-hidden bg-zinc-800 border-2 border-blue-500 shadow-2xl z-10 group">
            {!isCameraOff ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-white/5">
                <VideoOff className="w-10 h-10 text-gray-600" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 block bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider">
              You (Interpreter)
            </div>
          </div>
        </div>

        {/* Sidebar Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 border-l border-white/5 bg-[#020617] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Live Chat</h3>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 max-w-[80%]">
                  <p className="text-xs text-blue-400 font-bold mb-1">Client</p>
                  <p className="text-sm text-gray-300">Can you hear me clearly? I need help with medical translation.</p>
                </div>
                <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-600/20 max-w-[80%] ml-auto">
                  <p className="text-xs text-blue-500 font-bold mb-1 text-right">You</p>
                  <p className="text-sm text-gray-300">Yes, I'm ready. Please proceed.</p>
                </div>
              </div>
              <div className="p-6 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-[#020617] border-t border-white/5 px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl glass hover:bg-white/5 transition-all text-gray-400">
            <Users className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-2xl transition-all ${showChat ? "bg-blue-600 text-white" : "glass text-gray-400 hover:bg-white/5"}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? "bg-red-500 text-white" : "glass text-white hover:bg-white/5"}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCameraOff ? "bg-red-500 text-white" : "glass text-white hover:bg-white/5"}`}
          >
            {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          <button className="w-14 h-14 rounded-2xl gradient-bg text-white shadow-xl shadow-blue-500/20 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </button>
          
          <div className="w-px h-10 bg-white/5 mx-2" />

          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            End Session
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl glass hover:bg-white/5 transition-all text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            Quality: 1080p
          </button>
          <button className="p-3 rounded-2xl glass hover:bg-white/5 transition-all text-gray-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
