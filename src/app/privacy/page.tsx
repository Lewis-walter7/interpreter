"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Privacy <span className="gradient-text">Policy</span></h1>
          <p className="text-gray-500 mb-12 font-light">Last Updated: April 24, 2026</p>

          <div className="prose prose-invert prose-blue max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">1. Data Collection</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                We collect personal information necessary to facilitate interpretation sessions, including your name, email, and billing information. For interpreters, we also collect KYC documentation to verify identity and professional certification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">2. Session Privacy</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                LinguistBridge uses peer-to-peer WebRTC technology. This means that video and audio data are transmitted directly between the client and the interpreter. We do not record sessions or store any audio/video data on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">3. Third-Party Services</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                We use secure providers for essential services:
              </p>
              <ul className="list-disc list-inside text-gray-400 font-light space-y-2 mt-4 ml-4">
                <li>Pusher for real-time signaling and notifications.</li>
                <li>IntaSend for secure payment processing.</li>
                <li>UploadThing for secure KYC document storage.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">4. Your Rights</h2>
              <p className="text-gray-400 font-light leading-relaxed">
                You have the right to request access to your personal data, request corrections, or ask for account deletion at any time through our support portal.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
