"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Users, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-32">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight"
            >
              Connecting the <span className="gradient-text">Unspoken Word</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 font-light leading-relaxed"
            >
              LinguistBridge started at Multimedia University with a simple mission: to ensure that language is never a barrier to opportunity, justice, or health.
            </motion.p>
          </div>

          {/* Vision Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
            {[
              { icon: Target, title: "Our Mission", text: "Providing instant, high-quality interpretation for every sector." },
              { icon: Users, title: "Our People", text: "A global community of 1,200+ certified professional linguists." },
              { icon: ShieldCheck, title: "Our Trust", text: "Enterprise-grade security and rigorous native certification." },
              { icon: Heart, title: "Our Heart", text: "Enabling human connection where it matters most." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[40px] glass border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
                <div className="relative glass p-10 rounded-[60px] border border-white/10 aspect-square flex items-center justify-center overflow-hidden">
                   <div className="text-9xl font-black text-white/5 select-none absolute -top-10 -left-10">2026</div>
                   <div className="text-center">
                      <p className="text-7xl font-black gradient-text">99.9%</p>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-4">System Accuracy</p>
                   </div>
                </div>
             </div>
             <div className="space-y-8">
                <h2 className="text-4xl font-black text-white leading-tight">The Future of <br />Human Translation</h2>
                <p className="text-gray-400 font-light leading-relaxed">
                   Founded as a flagship project for innovation in real-time communication, LinguistBridge leverages WebRTC technology and high-performance server clusters to deliver zero-latency interpretation.
                </p>
                <p className="text-gray-400 font-light leading-relaxed">
                   We believe that while AI is advancing, the nuance, empathy, and cultural context of a human interpreter remains indispensable in critical situations—from emergency rooms to international courtrooms.
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 gradient-bg rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                     Explore Our Metrics
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
