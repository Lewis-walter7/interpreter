"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Languages, 
  ScrollText, 
  DollarSign, 
  Camera, 
  CheckCircle2, 
  Loader2,
  BrainCircuit,
  ShieldCheck,
  X
} from "lucide-react";
import { updateProfile } from "@/app/actions/settings";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function InterpreterSettings({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [langInput, setLangInput] = useState("");
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    phoneNumber: user.phoneNumber || "",
    bio: user.interpreterData?.bio || "",
    specialization: user.interpreterData?.specialization || "",
    hourlyRate: user.interpreterData?.hourlyRate || 40,
    languages: user.interpreterData?.languages || [],
    image: user.image || ""
  });

  const addLanguage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (langInput.trim() && !formData.languages.includes(langInput.trim())) {
        setFormData({
          ...formData,
          languages: [...formData.languages, langInput.trim()]
        });
        setLangInput("");
      }
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l: string) => l !== langToRemove)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formattedData = {
      ...formData,
      interpreterData: {
        bio: formData.bio,
        specialization: formData.specialization,
        hourlyRate: Number(formData.hourlyRate),
        languages: formData.languages
      }
    };

    const res = await updateProfile(formattedData);
    if (res.success) {
      setSuccess(true);
      toast.success("Professional Profile Updated!");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      toast.error(res.error || "Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl pb-32">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Header & Avatar */}
        <div className="glass-dark p-10 rounded-[48px] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10 group-hover:bg-blue-500/10 transition-all duration-1000" />
           
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                 <div className="w-32 h-32 rounded-3xl gradient-bg p-1 shadow-2xl shadow-blue-500/20">
                    <div className="w-full h-full rounded-[22px] bg-[#020617] overflow-hidden flex items-center justify-center">
                       {formData.image ? (
                          <img src={formData.image} className="w-full h-full object-cover" alt="" />
                       ) : (
                          <User className="w-12 h-12 text-blue-500" />
                       )}
                    </div>
                 </div>
                 <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-slate-900 border border-white/10 rounded-2xl text-blue-500 hover:text-white hover:bg-blue-600 transition-all shadow-xl">
                    <Camera className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                 <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">{formData.name || "Expert Identity"}</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] italic mt-1">LinguistBridge Professional</p>
                 </div>
                 <div className="flex justify-center md:justify-start gap-4">
                    <div className="px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3 text-blue-500" />
                       <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">VERIFIED PRO</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Identity & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-dark p-8 rounded-[40px] border border-white/5 space-y-6">
              <h3 className="text-white font-bold flex items-center gap-3 italic">
                 <User className="w-4 h-4 text-blue-500" />
                 Core Identity (Locked)
              </h3>
              <div className="space-y-4">
                 <div className="relative group opacity-60 cursor-not-allowed">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                       type="text"
                       value={formData.name}
                       disabled
                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-gray-500 cursor-not-allowed"
                       placeholder="Full professional name"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black text-blue-500 uppercase">KYC PROTECTED</span>
                    </div>
                 </div>
                 <div className="relative group opacity-50 cursor-not-allowed">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                       type="email"
                       value={user.email}
                       disabled
                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-gray-500 cursor-not-allowed"
                    />
                 </div>
                 <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                       type="text"
                       value={formData.phoneNumber}
                       onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                       placeholder="Mobile verification number"
                    />
                 </div>
              </div>
           </div>

           <div className="glass-dark p-8 rounded-[40px] border border-white/5 space-y-6">
              <h3 className="text-white font-bold flex items-center gap-3 italic">
                 <DollarSign className="w-4 h-4 text-blue-500" />
                 Linguistic Rate
              </h3>
              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6 italic">Set your professional hourly fee (USD)</p>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-black italic text-white">${formData.hourlyRate}</span>
                    <span className="text-xs font-black text-blue-500 italic uppercase">Per Hour</span>
                 </div>
                 <input 
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <div className="flex justify-between mt-2 text-[8px] font-black text-gray-700 uppercase tracking-widest">
                    <span>$20 MIN</span>
                    <span>$200 MAX</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Professional Expertise & Dynamic Tagging */}
        <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h3 className="text-white font-bold flex items-center gap-3 italic">
                    <Languages className="w-5 h-5 text-blue-500" />
                    Language Mastery (Press Enter)
                 </h3>
                 
                 <div className="flex flex-wrap gap-2 mb-4">
                    <AnimatePresence mode="popLayout">
                       {formData.languages.map((lang: string) => (
                          <motion.div 
                             key={lang}
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             exit={{ scale: 0.8, opacity: 0 }}
                             className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-2 group/tag"
                          >
                             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{lang}</span>
                             <button 
                                type="button"
                                onClick={() => removeLanguage(lang)}
                                className="text-blue-500/50 hover:text-blue-500 hover:scale-110 transition-all"
                             >
                                <X className="w-3 h-3" />
                             </button>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>

                 <div className="relative group">
                    <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                       type="text"
                       value={langInput}
                       onChange={(e) => setLangInput(e.target.value)}
                       onKeyDown={addLanguage}
                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all italic"
                       placeholder="Type and press Enter to add..."
                    />
                 </div>
                 <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">The languages you are officially qualified to interpret.</p>
              </div>

              <div className="space-y-6">
                 <h3 className="text-white font-bold flex items-center gap-3 italic">
                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                    Primary Specialization
                 </h3>
                 <div className="relative group">
                    <BrainCircuit className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                       type="text"
                       value={formData.specialization}
                       onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                       placeholder="e.g. Medical, Legal, Corporate"
                    />
                 </div>
                 <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">Your dominant professional niche for matching purposes.</p>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5 space-y-6">
              <h3 className="text-white font-bold flex items-center gap-3 italic">
                 <ScrollText className="w-5 h-5 text-blue-500" />
                 Professional Bio
              </h3>
              <textarea 
                 value={formData.bio}
                 onChange={(e) => setFormData({...formData, bio: e.target.value})}
                 rows={4}
                 className="w-full bg-white/5 border border-white/5 rounded-[32px] p-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                 placeholder="Describe your expertise and professional background..."
              />
           </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end p-4">
           <button 
             type="submit" 
             disabled={loading}
             className={`px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 relative overflow-hidden group/btn ${
               success 
               ? "bg-green-500 text-white shadow-xl shadow-green-500/20" 
               : "gradient-bg text-white shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95"
             }`}
           >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
              {success ? "PROFILE SECURED" : "PERSIST UPDATES"}
           </button>
        </div>
      </form>
    </div>
  );
}
