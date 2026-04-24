"use client";

import React, { useState } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Languages, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  MessageSquare,
  Lock,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "@/app/actions/settings";

interface SettingsViewProps {
  user: any;
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.interpreterData?.bio || "");
  const [langList, setLangList] = useState<string[]>(user.interpreterData?.languages || []);
  const [langInput, setLangInput] = useState("");
  const [specialization, setSpecialization] = useState(user.interpreterData?.specialization || "");

  const handleAddLanguage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = langInput.trim();
      if (val && !langList.includes(val)) {
        setLangList([...langList, val]);
        setLangInput("");
      }
    }
  };

  const removeLanguage = (lang: string) => {
    setLangList(langList.filter(l => l !== lang));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await updateProfile({
      email,
      phone,
      bio,
      languages: langList,
      specialization
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || "Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 pb-32">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-500 font-medium">Manage your profile and communication preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IDENTITY SECTION (LOCKED) */}
        <section className="glass-dark rounded-[40px] border border-white/5 p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
            <Lock className="w-6 h-6 text-white/10" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Identity & Verification</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 opacity-50">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
              <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium flex items-center gap-3 cursor-not-allowed">
                <UserIcon className="w-5 h-5 text-gray-500" />
                {user.name}
              </div>
            </div>

            <div className="space-y-2 opacity-50">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Verification Status</label>
              <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-blue-500 font-bold flex items-center gap-3 cursor-not-allowed uppercase text-xs tracking-tighter">
                <CheckCircle2 className="w-5 h-5" />
                {user.status || "Verified"}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs">
            <Info className="w-4 h-4 shrink-0" />
            To change your name or verification documents, please contact support.
          </div>
        </section>

        {/* COMMUNICATION SECTION */}
        <section className="glass-dark rounded-[40px] border border-white/5 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ROLE SPECIFIC SECTION (INTERPRETER) */}
        {user.role === "interpreter" && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-[40px] border border-white/5 p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Languages className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Interpreter Profile</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Specialization</label>
                <input 
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Medical, Legal, Technical"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Languages (Press Enter to add)</label>
                <div className="bg-black/20 border border-white/10 rounded-3xl p-4 flex flex-wrap gap-3 focus-within:border-green-500/50 transition-all min-h-[80px]">
                  <AnimatePresence>
                    {langList.map((lang) => (
                      <motion.div 
                        key={lang}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold"
                      >
                        {lang}
                        <button 
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="w-4 h-4 flex items-center justify-center hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <input 
                    type="text"
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    onKeyDown={handleAddLanguage}
                    placeholder={langList.length === 0 ? "Type a language and press Enter..." : ""}
                    className="flex-1 bg-transparent border-none text-white placeholder:text-gray-600 focus:outline-none font-medium min-w-[150px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Bio</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief intro about your experience..."
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium resize-none"
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* STATUS MESSAGES */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 flex items-center gap-3 font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              Settings updated successfully!
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-3 font-bold"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTION BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-bg py-6 rounded-[32px] text-white font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Save className="w-6 h-6" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
