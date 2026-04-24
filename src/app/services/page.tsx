"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Video, Mic, ShieldCheck, Scale, HeartPulse, Building2, Zap, Languages } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "video",
      icon: Video,
      title: "Video Interpretation",
      text: "High-definition, low-latency video sessions for face-to-face communication across any language barrier.",
      features: ["HD Quality", "Screen Sharing", "Multi-party support"]
    },
    {
      id: "legal",
      icon: Scale,
      title: "Legal & Court Support",
      text: "Certified legal interpreters familiar with judicial terminology and professional ethics.",
      features: ["Court certified", "Confidentiality guaranteed", "24/7 Priority"]
    },
    {
      id: "medical",
      icon: HeartPulse,
      title: "Medical & Healthcare",
      text: "Supporting doctors and patients with specialized medical linguists trained in healthcare contexts.",
      features: ["HIPAA compliant", "Terminology experts", "Instant access"]
    },
    {
      id: "enterprise",
      icon: Building2,
      title: "Enterprise Solutions",
      text: "Customized language solutions for global corporations and international organizations.",
      features: ["API Integration", "Dedicated Support", "Volume Discounts"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-32">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
             >
               Our <span className="gradient-text">Services</span>
             </motion.h1>
             <p className="text-xl text-gray-400 font-light">
               Enterprise-grade language solutions tailored for high-stakes environments.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-32">
             {services.map((service, i) => (
               <motion.div 
                 key={service.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="p-12 rounded-[56px] glass border border-white/5 hover:border-blue-500/30 transition-all group"
               >
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                     <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black mb-6">{service.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed mb-10 text-lg">
                    {service.text}
                  </p>
                  <div className="flex flex-wrap gap-3">
                     {service.features.map((f, j) => (
                       <span key={j} className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/5">
                         {f}
                       </span>
                     ))}
                  </div>
               </motion.div>
             ))}
          </div>

          {/* Call to Action Section */}
          <div className="relative p-16 md:p-24 rounded-[64px] overflow-hidden">
             <div className="absolute inset-0 gradient-bg opacity-10" />
             <div className="absolute inset-0 border border-white/10 rounded-[64px]" />
             <div className="relative z-10 text-center max-w-2xl mx-auto">
                <Languages className="w-16 h-16 text-blue-500 mx-auto mb-10" />
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Need a Specialized <br /> Language Hub?</h2>
                <p className="text-gray-400 font-light mb-12">
                   Contact our sales team for custom integrations and large-scale language deployment tailored for your specific industry needs.
                </p>
                <button className="px-12 py-5 gradient-bg rounded-[26px] font-black text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                   Contact Sales Strategy
                </button>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
