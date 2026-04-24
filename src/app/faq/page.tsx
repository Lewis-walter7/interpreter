"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle, Shield, CreditCard, Search } from "lucide-react";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("general");

  const faqs = {
    general: [
      { q: "How do I book an interpreter?", a: "You can browse our marketplace, select a linguist based on their language and specialization, and click 'Schedule' or 'Instant Call' depending on their availability." },
      { q: "How are interpreters verified?", a: "Every interpreter must provide proof of certification and undergo a rigorous KYC process involving identity verification and language proficiency checks." },
      { q: "Which platforms are supported?", a: "LinguistBridge runs on any modern web browser across desktop, tablet, and mobile devices. No app download is required." }
    ],
    billing: [
      { q: "What are the payment methods?", a: "We support all major credit cards and secure digital payments via IntaSend, including localized options like M-Pesa where available." },
      { q: "When am I charged?", a: "For scheduled sessions, payment is held in escrow and released to the interpreter after the session is successfully marked as completed." }
    ],
    security: [
      { q: "Is my data secure?", a: "Yes. All video and voice calls are encrypted using WebRTC AES encryption, and no session data or recordings are stored on our servers." },
      { q: "How is my privacy protected?", a: "We adhere to strict data protection protocols. Interpreters are bound by professional confidentiality agreements." }
    ]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl font-black mb-6 tracking-tighter">Support & <span className="gradient-text">FAQ Center</span></h1>
            <p className="text-gray-400 font-light">Find answers to common questions or reach out to our dedicated support team.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Sidebar Tabs */}
            <div className="space-y-4">
              {[
                { id: "general", label: "General", icon: HelpCircle },
                { id: "billing", label: "Billing", icon: CreditCard },
                { id: "security", label: "Security", icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                    activeTab === tab.id 
                    ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20 text-white" 
                    : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-widest uppercase">{tab.label}</span>
                </button>
              ))}
              
              <div className="mt-12 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                <MessageCircle className="w-8 h-8 text-blue-500 mb-4" />
                <h4 className="text-white font-bold mb-2">Still need help?</h4>
                <p className="text-gray-500 text-xs font-light leading-relaxed mb-6">Our team is available 24/7 for critical account support.</p>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Contact Us</button>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {faqs[activeTab as keyof typeof faqs].map((item, i) => (
                    <div key={i} className="p-8 rounded-[32px] glass border border-white/5 hover:border-white/10 transition-all">
                       <h3 className="text-xl font-bold mb-4 flex items-start gap-4">
                          <span className="text-blue-500">Q.</span>
                          {item.q}
                       </h3>
                       <p className="text-gray-500 font-light leading-relaxed pl-8">
                          {item.a}
                       </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
