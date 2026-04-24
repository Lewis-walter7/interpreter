"use client";

import React from "react";
import Link from "next/link";
import { Languages, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="bg-[#010409] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="gradient-bg p-2 rounded-lg">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">LinguistBridge</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              The world's leading real-time interpretation marketplace. Connecting professional linguists with global clients through high-definition video technology.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/50 transition-all border border-white/5">
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all border border-white/5">
                <FaGithub className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600/50 transition-all border border-white/5">
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Services</h4>
            <ul className="space-y-4">
              <li><Link href="/services#video" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Video Interpretation</Link></li>
              <li><Link href="/services#voice" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">HD Voice Calls</Link></li>
              <li><Link href="/services#legal" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Certified Legal Support</Link></li>
              <li><Link href="/services#medical" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Medical Language Hub</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Our Story</Link></li>
              <li><Link href="/faq" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Help & FAQ</Link></li>
              <li><Link href="/metrics" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Impact Metrics</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-blue-400 text-sm transition-colors font-light">Carrier Relations</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Legal & Contact</h4>
            <ul className="space-y-4 text-sm font-light text-gray-500">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-500" /> support@linguistbridge.com</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-blue-500" /> Multimedia University, Nairobi</li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-light tracking-wide">
            © 2026 LinguisBridge. All rights reserved. Registered MMU Project.
          </p>
          <div className="flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Network Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
