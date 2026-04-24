"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Languages, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smart routing for logo
  const getHubRoute = () => {
    if (!session?.user) return "/";
    const role = (session.user as any).role;
    if (role === "admin") return "/dashboard/admin";
    if (role === "interpreter") return "/dashboard/interpreter";
    if (role === "client") return "/dashboard/client";
    return "/dashboard";
  };

  const hubRoute = getHubRoute();

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
        ? "py-3 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/10" 
        : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href={hubRoute} className="flex items-center gap-2 group">
          <div className="gradient-bg p-2 rounded-xl group-hover:scale-110 transition-transform duration-500">
            <Languages className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">LinguistBridge</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-[13px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Home</Link>
          <Link href="/services" className="text-[13px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Services</Link>
          <Link href="/marketplace" className="text-[13px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Marketplace</Link>
          <Link href="/about" className="text-[13px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">About</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
            Login
          </Link>
          <Link href="/register" className="gradient-bg px-8 py-3 rounded-full text-xs font-black text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em]">
            Join Engine
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-8 flex flex-col gap-6 md:hidden z-50 shadow-2xl"
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-white">Home</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-white">Services</Link>
            <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-white">Marketplace</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-white">About Us</Link>
            <hr className="border-white/5" />
            <div className="flex flex-col gap-4">
              <Link href="/login" className="w-full py-4 text-center text-gray-400 font-bold">Login</Link>
              <Link href="/register" className="w-full py-4 text-center gradient-bg rounded-2xl font-black text-white shadow-xl shadow-blue-500/10">Register Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
