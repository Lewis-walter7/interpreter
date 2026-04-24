"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Video,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Languages,
  Zap,
  Users
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -z-10" />

        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-8 text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase glass rounded-full border border-blue-500/20">
              Transforming Communication
            </span>
            <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.9]">
              Linguistic <br />
              <span className="gradient-text">Freedom</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
              Connect with certified professional interpreters instantly via HD video. Breaking global language barriers in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/marketplace" className="group gradient-bg px-10 py-5 rounded-[22px] text-lg font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/30">
                Book a Linguist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register?role=interpreter" className="px-10 py-5 rounded-[22px] text-lg font-black glass hover:bg-white/5 transition-all border border-white/5">
                Join as Professional
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {[
              { v: "150+", l: "Languages" },
              { v: "24/7", l: "Availability" },
              { v: "4.9/5", l: "User Rating" },
              { v: "100%", l: "Verified Hub" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">{stat.v}</p>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section id="services" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black tracking-tight mb-4">Commercial Grade <span className="gradient-text">Solutions</span></h2>
              <p className="text-gray-500 font-light text-xl leading-relaxed">Built for high-stakes environments where precision communication isn't optional—it's mandatory.</p>
            </div>
            <Link href="/services" className="px-8 py-4 glass rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all whitespace-nowrap">View All Services</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Video, t: "Video Hub", d: "P2P HD streaming with near-zero latency for visual interpretation." },
              { icon: ShieldCheck, t: "Luxe Security", d: "End-to-end encrypted sessions with verified professional linguists." },
              { icon: Languages, t: "Native Focus", d: "Access native specialized terminology in law, medicine, and tech." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[44px] glass border border-white/5 hover:border-blue-500/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 text-blue-500 group-hover:rotate-12 transition-transform">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4">{item.t}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-40 px-6 overflow-hidden relative text-center">
        <div className="absolute inset-0 bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="container mx-auto relative z-10 max-w-4xl">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">Ready to Cross <br /> the Bridge?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/register" className="gradient-bg px-12 py-5 rounded-[26px] text-lg font-black shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all">
              Launch Account
            </Link>
            <Link href="/about" className="glass px-12 py-5 rounded-[26px] text-lg font-black hover:bg-white/5 transition-all">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
