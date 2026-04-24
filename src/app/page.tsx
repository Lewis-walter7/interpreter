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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="gradient-bg p-2 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LinguistBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/marketplace" className="hover:text-white transition-colors">Find Interpreters</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2 text-sm font-medium hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link href="/register" className="gradient-bg px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -z-10" />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase glass rounded-full border border-blue-500/20">
              Transforming Communication
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
              Real-Time Interpretation <br />
              <span className="gradient-text">Across Any Distance</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Connect with certified professional interpreters instantly via HD video and crystal-clear voice calls. Breaking language barriers in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/marketplace" className="group gradient-bg px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                Book an Interpreter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register?role=interpreter" className="px-8 py-4 rounded-full text-lg font-bold glass hover:bg-white/5 transition-all">
                Become an Interpreter
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto border-t border-white/5 pt-12"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">50+</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Languages</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">1.2k</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Interpreters</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">99.9%</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Uptime</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">4.9/5</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#010409]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Seamless Matching</h2>
            <p className="text-gray-500 max-w-xl mx-auto font-light">
              Everything you need to manage your language requests in one centralized dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">HD Video & Voice</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Connect via peer-to-peer WebRTC technology for the lowest latency and highest quality possible.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Matching</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Our smart algorithm matches you with available interpreters based on language pair and specialization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-pink-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified KYC</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Every interpreter undergoes a rigorous background check and certification verification process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#020617]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2 text-white">
            <Languages className="w-5 h-5 text-blue-500" />
            <span className="font-bold tracking-tight">LinguistBridge</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>
          <div>
            © 2026 LinguistBridge. Multimedia University Project.
          </div>
        </div>
      </footer>
    </div>
  );
}
