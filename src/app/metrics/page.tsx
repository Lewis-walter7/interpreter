"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BarChart3, Globe2, Zap, Clock, Star, ShieldCheck } from "lucide-react";

export default function MetricsPage() {
  const stats = [
    { icon: Globe2, label: "Languages", value: "150+", color: "text-blue-400" },
    { icon: Clock, label: "Minutes Live", value: "2.4M", color: "text-blue-500" },
    { icon: Star, label: "Customer Rating", value: "4.9/5", color: "text-blue-600" },
    { icon: ShieldCheck, label: "Secure Handshakes", value: "98k", color: "text-sky-500" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-32">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
            >
              Real-Time <span className="gradient-text">Impact</span>
            </motion.h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Measuring our success by the barriers we break and the connections we enable every single second across the globe.
            </p>
          </div>

          {/* Core Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
            {stats.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[48px] glass border border-white/5 text-center relative overflow-hidden group"
              >
                 <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${item.color.replace('text-', 'bg-')}`} />
                 <item.icon className={`w-10 h-10 mx-auto mb-6 ${item.color} group-hover:scale-110 transition-transform`} />
                 <h3 className="text-5xl font-black text-white mb-2 leading-none">{item.value}</h3>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart Mockup */}
          <div className="glass p-12 rounded-[60px] border border-white/10 mb-40 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full" />
             <div className="relative z-10 grid lg:grid-cols-3 gap-20">
                <div className="lg:col-span-1 space-y-6">
                   <h2 className="text-4xl font-black leading-tight">Operational <br /> Excellence</h2>
                   <p className="text-gray-500 font-light leading-relaxed">
                     Our infrastructure is designed for 99.99% availability, ensuring that critical interpretation lines are always open when every second counts.
                   </p>
                   <div className="space-y-4 pt-6">
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">P2P Latency</span>
                         <span className="text-xl font-black text-blue-500">{"< 150ms"}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Connect Speed</span>
                         <span className="text-xl font-black text-purple-500">{"8s Avg"}</span>
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-2 flex items-end gap-3 h-[400px]">
                   {[40, 70, 45, 90, 65, 80, 100, 60, 85, 95].map((h, i) => (
                     <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                        className="flex-1 gradient-bg rounded-t-2xl opacity-60 hover:opacity-100 transition-opacity"
                     />
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
