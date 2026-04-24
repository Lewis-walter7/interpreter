"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Maximize,
  ShieldCheck,
  User,
  MessagesSquare,
  ChevronRight,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pusherClient } from "@/lib/pusher-client";
import { useRouter, useSearchParams } from "next/navigation";
import { finalizeSession } from "@/app/actions/interpreter";

interface VideoRoomProps {
  roomId: string;
  user: any;
  isCaller: boolean;
}

export default function VideoRoom({ roomId, user, isCaller }: VideoRoomProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interpreterId = searchParams.get("i");

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [status, setStatus] = useState("Initializing secure tunnel...");
  const [duration, setDuration] = useState(0);
  
  // Rating States
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const backdropVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const hasRemoteDescription = useRef(false);
  const isProcessingSignal = useRef(false);
  const hasInitialized = useRef(false);

  // Call Timer Effect
  useEffect(() => {
    let interval: any;
    if (remoteStream) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [remoteStream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    const initWebRTC = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }, 
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
        
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });

        peerConnection.current.ontrack = (event) => {
          const stream = event.streams[0];
          setRemoteStream(stream);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
          if (backdropVideoRef.current) backdropVideoRef.current.srcObject = stream;
          setStatus("Connected");
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal({ candidate: event.candidate });
          }
        };

        // Subscribe to signaling channel
        const channel = pusherClient.subscribe(`room-${roomId}`);
        
        channel.bind("signal", async (data: any) => {
          if (data.userId === user.id || !peerConnection.current || isProcessingSignal.current) return;

          try {
            if (data.offer) {
              if (peerConnection.current.signalingState !== "stable") return;
              isProcessingSignal.current = true;
              
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
              hasRemoteDescription.current = true;
              
              while (candidateQueue.current.length > 0) {
                const cand = candidateQueue.current.shift();
                if (cand) await peerConnection.current.addIceCandidate(new RTCIceCandidate(cand));
              }

              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);
              sendSignal({ answer });
            } else if (data.answer) {
              if (peerConnection.current.signalingState !== "have-local-offer") return;
              isProcessingSignal.current = true;
              
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
              hasRemoteDescription.current = true;
              
              while (candidateQueue.current.length > 0) {
                const cand = candidateQueue.current.shift();
                if (cand) await peerConnection.current.addIceCandidate(new RTCIceCandidate(cand));
              }
            } else if (data.candidate) {
              if (hasRemoteDescription.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              } else {
                candidateQueue.current.push(data.candidate);
              }
            } else if (data.end) {
              cleanupHardware();
              if (isCaller && interpreterId) {
                setShowRating(true);
              } else {
                router.push("/dashboard");
              }
            }
          } catch (err) {
            console.error("Signaling Handshake Error:", err);
          } finally {
            isProcessingSignal.current = false;
          }
        });

        if (isCaller) {
          setStatus("Calling interpreter...");
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          sendSignal({ offer });
        } else {
          setStatus("Establishing handshake...");
        }

      } catch (err) {
        console.error("WebRTC Error:", err);
        setStatus("Could not access camera/mic.");
      }
    };

    initWebRTC();

    return () => {
      cleanupHardware();
    };
  }, [roomId, !!pusherClient]);

  const sendSignal = (data: any) => {
    fetch('/api/signal', {
      method: "POST",
      body: JSON.stringify({ roomId, data: { ...data, userId: user.id } })
    });
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !cameraOn;
      });
      setCameraOn(!cameraOn);
    }
  };

  const cleanupHardware = () => {
    localStream?.getTracks().forEach(t => t.stop());
    peerConnection.current?.close();
    peerConnection.current = null;
    pusherClient.unsubscribe(`room-${roomId}`);
  };

  const endCall = () => {
    sendSignal({ end: true });
    cleanupHardware();
    if (isCaller && interpreterId) {
      setShowRating(true);
    } else {
      router.push("/dashboard");
    }
  };

  const submitRating = async () => {
    if (!interpreterId) {
      router.push("/dashboard");
      return;
    }
    
    setIsSubmitting(true);
    await finalizeSession(interpreterId, rating, duration, roomId, user.id || user._id);
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] overflow-hidden font-sans">
      {/* Remote Video (Main Stage) */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        {/* Layer 1: Blurred Bokeh Backdrop (The 'Luxe' part) */}
        {remoteStream && (
          <div className="absolute inset-0 z-0 opacity-40 scale-125 blur-[100px] pointer-events-none">
             <video 
              ref={backdropVideoRef}
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Layer 2: Main Sharp Video */}
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        />
        
        {!remoteStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-20">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <User className="w-12 h-12 text-blue-500/40" />
              </div>
            </div>
            <p className="mt-8 text-blue-500 font-bold tracking-[0.2em] uppercase text-[10px] animate-pulse">
              {status}
            </p>
          </div>
        )}

        {/* Local Video (Sleek Floating PIP) */}
        <motion.div 
          drag
          dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
          className="absolute bottom-32 right-8 w-44 md:w-64 aspect-video glass-dark rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-30 cursor-move"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover mirror bg-gray-900"
          />
          {!cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
               <User className="w-8 h-8 text-white/10" />
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 glass-dark px-2 py-1 rounded-lg border border-white/5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest">You</span>
          </div>
        </motion.div>

        {/* HUD Overlay */}
        <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
          <div className="glass-dark px-5 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3 backdrop-blur-3xl shadow-xl">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-white/80 font-bold text-[11px] uppercase tracking-wider">
              {remoteStream ? `Connected • ${formatDuration(duration)}` : "Securing Line..."}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Floating Control Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
         <div className="glass-dark p-2.5 rounded-[40px] border border-white/10 flex items-center gap-3 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <button 
              onClick={toggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${micOn ? "bg-white/5 text-white hover:bg-white/10" : "bg-red-500 text-white shadow-lg shadow-red-500/30"}`}
            >
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            
            <button 
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${cameraOn ? "bg-white/5 text-white hover:bg-white/10" : "bg-red-500 text-white shadow-lg shadow-red-500/30"}`}
            >
              {cameraOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <div className="w-px h-8 bg-white/10 mx-1" />

            <button 
              onClick={endCall}
              className="group pl-6 pr-8 h-14 rounded-full bg-red-500 text-white font-black flex items-center gap-3 shadow-xl shadow-red-500/40 hover:bg-red-600 hover:scale-[1.05] active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-[135deg] transition-transform duration-500">
                <PhoneOff className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xs uppercase tracking-widest">End Call</span>
            </button>
         </div>
      </div>

      {/* Session Footer Info */}
      <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-3 z-20">
         <div className="w-8 h-8 rounded-lg glass-dark border border-white/5 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-500/50" />
         </div>
         <div className="flex flex-col">
           <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.3em]">Session Hash</p>
           <p className="text-blue-500/30 text-[9px] font-mono">{roomId}</p>
         </div>
      </div>
      
      {/* RATING MODAL (Client Only) */}
      <AnimatePresence>
        {showRating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#020617] border border-white/10 rounded-[48px] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 gradient-bg" />
              
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-8">
                <Star className="w-10 h-10 fill-blue-500" />
              </div>

              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Excellent Session!</h2>
              <p className="text-gray-400 font-light mb-10">Rate your experience with the linguist</p>

              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      rating >= star 
                      ? "bg-yellow-500/10 text-yellow-500 scale-110" 
                      : "bg-white/5 text-gray-700 hover:bg-white/10"
                    }`}
                  >
                    <Star className={`w-8 h-8 ${rating >= star ? "fill-yellow-500" : "text-gray-800"}`} />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={submitRating}
                  disabled={isSubmitting}
                  className="w-full gradient-bg py-5 rounded-[22px] text-white font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Updating Marketplace..." : "Post Review"}
                </button>
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
                  disabled={isSubmitting}
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
