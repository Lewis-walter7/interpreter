"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Terms of <span className="gradient-text">Service</span></h1>
          <p className="text-gray-500 mb-12 font-light">Last Updated: April 24, 2026</p>

          <div className="prose prose-invert prose-blue max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">1. Platform Usage</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                LinguistBridge provides a marketplace platform connecting clients with freelance interpreters. By using our services, you agree to provide accurate information and conduct yourself professionally during all interactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">2. Booking & Cancellation</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                Bookings are confirmed only when the interpreter accepts the request. Cancellations made within 2 hours of the session start time may be subject to a cancellation fee to compensate the linguist for their reserved time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">3. Payments & Escrow</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                LinguistBridge uses a secure escrow system. Payment is captured upon booking confirmation and released to the interpreter after the session is successfully completed. Fees are inclusive of platform commissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">4. Professional Conduct</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                Interpreters agree to maintain strict confidentiality and provide accurate, neutral interpretation. Clients agree to maintain a professional environment and refrain from any form of harassment.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
