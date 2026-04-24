"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, ShieldCheck, Loader2, Scan, ArrowRight, Check } from "lucide-react";

interface FaceLivenessProps {
  onCapture: (url: string) => void;
  isProcessing: boolean;
}

const CHALLENGES = [
  { id: 'nod', label: "Slowly nod your head", icon: "↕️" },
  { id: 'right', label: "Turn your face to the right", icon: "➡️" },
  { id: 'left', label: "Turn your face to the left", icon: "⬅️" },
  { id: 'shake', label: "Gently shake your head", icon: "↔️" },
];

export default function FaceLiveness({ onCapture, isProcessing }: FaceLivenessProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: Ready, 0-3: Challenges, 4: Done
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (currentStep >= 0 && currentStep < CHALLENGES.length) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(curr => curr + 1), 500);
            return 100;
          }
          return prev + 2; // Simulate detection speed
        });
      }, 50);
    } else if (currentStep === CHALLENGES.length) {
      // All challenges complete, capture the final frame
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImg(imageSrc);
        onCapture(imageSrc);
      }
    }
    return () => clearInterval(interval);
  }, [currentStep, onCapture]);

  const startVerification = () => {
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-80 mb-10">
        {/* Biometric Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            className="w-full h-full"
          />
          {currentStep >= 0 && (
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              fill="transparent"
              stroke="url(#blue-gradient)"
              strokeWidth="8"
              strokeDasharray="942"
              animate={{ strokeDashoffset: 942 - (942 * progress) / 100 }}
              transition={{ ease: "linear" }}
              strokeLinecap="round"
            />
          )}
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-4 overflow-hidden rounded-full border-4 border-white/5 bg-black/40 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          {!capturedImg ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover scale-150"
              videoConstraints={{
                facingMode: "user",
                width: 400,
                height: 400
              }}
            />
          ) : (
            <img src={capturedImg} alt="Face Capture" className="w-full h-full object-cover" />
          )}

          {/* Scanning Hud Interface */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-blue-500/30 rounded-[60px] border-dashed" />
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {currentStep === CHALLENGES.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="bg-white rounded-full p-3 shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-blue-600" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Challenge Instruction Bubble */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && currentStep < CHALLENGES.length && (
            <motion.div
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[280px] glass-dark border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3 shadow-2xl z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                {CHALLENGES[currentStep].icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Challenge {currentStep + 1}</p>
                <p className="text-sm font-bold text-white">{CHALLENGES[currentStep].label}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentStep === -1 ? (
        <button
          onClick={startVerification}
          className="group flex items-center gap-3 px-10 py-5 rounded-2xl gradient-bg text-white font-black hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-blue-500/20"
        >
          <Scan className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          Start Liveness Check
        </button>
      ) : currentStep < CHALLENGES.length ? (
        <div className="flex flex-col items-center gap-4">
           <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? "bg-blue-500" : i < currentStep ? "bg-green-500" : "bg-white/10"}`} />
            ))}
           </div>
           <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black animate-pulse">Analyzing Movement...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex items-center gap-2 text-green-500 font-bold px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
            <Check className="w-5 h-5" />
            Liveness Verified
          </div>
          {!isProcessing && (
            <button
              onClick={() => {
                setCapturedImg(null);
                setCurrentStep(-1);
              }}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white mx-auto transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Biometric
            </button>
          )}
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs w-full opacity-30">
        <div className="h-0.5 bg-white/20 rounded-full" />
        <div className="h-0.5 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
