"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Languages,
  ArrowRight,
  ShieldAlert,
  FileType,
  UserCheck
} from "lucide-react";
import { submitKYC } from "@/app/actions/interpreter";
import { UploadDropzone } from "@/lib/uploadthing";
import FaceLiveness from "./FaceLiveness";

export default function KYCOnboarding({ user }: { user: any }) {
  const [step, setStep] = useState(user.interpreterData?.status === "pending" ? 4 : 1);
  const [loading, setLoading] = useState(false);
  
  const [idFront, setIdFront] = useState<{name: string, url: string} | null>(null);
  const [idBack, setIdBack] = useState<{name: string, url: string} | null>(null);
  const [cert, setCert] = useState<{name: string, url: string} | null>(null);
  const [faceSelfie, setFaceSelfie] = useState<string | null>(null);

  const handleFinalSubmit = async () => {
    if (!idFront || !idBack || !faceSelfie) return;
    setLoading(true);
    
    const allFiles = [
      { name: idFront.name, url: idFront.url, category: "ID Front" },
      { name: idBack.name, url: idBack.url, category: "ID Back" },
      { name: "biometric_match.jpg", url: faceSelfie, category: "Face Verification" },
      ...(cert ? [{ name: cert.name, url: cert.url, category: "Professional Certification" }] : [])
    ];

    const res = await submitKYC(user._id, allFiles);

    if (res.success) {
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-black text-white tracking-tight">Interpreter Verification</h1>
        </div>
        <p className="text-gray-400 font-light max-w-lg mx-auto">
          Securely verify your identity using our biometric matching system.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
                  step >= i ? "gradient-bg text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-gray-500 border border-white/10"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              {i < 4 && (
                <div className="w-12 h-1 relative bg-white/5 overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step > i ? "100%" : "0%" }}
                    className="absolute inset-y-0 left-0 bg-blue-500"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />

        {step === 1 && (
          <div className="space-y-10 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Verification Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
                {[
                  { title: "ID Upload", desc: "Front & Back Documents", icon: FileText },
                  { title: "Face Match", desc: "Live Biometric Scan", icon: UserCheck },
                  { title: "Final Review", desc: "Manual Compliance Check", icon: ShieldCheck }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <feature.icon className="w-6 h-6 text-blue-500 mb-3" />
                    <h4 className="font-bold text-white text-sm mb-1">{feature.title}</h4>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setStep(2)} 
              className="w-full gradient-bg py-5 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Begin Verification <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Step 2: Legal Documents</h2>
              <p className="text-gray-500 text-sm italic">Please provide clear images of your ID.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Front ID */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">ID Front</label>
                {idFront ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-blue-500/30 group">
                    <img src={idFront.url} alt="ID Front" className="w-full h-full object-cover" />
                    <button onClick={() => setIdFront(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative glass-dark rounded-3xl border border-white/5 overflow-hidden transition-all hover:bg-white/5">
                    <UploadDropzone 
                      endpoint="kycUploader" 
                      onClientUploadComplete={(res) => setIdFront(res[0])} 
                      className="ut-label:text-blue-400 ut-label:text-xs ut-button:cursor-pointer ut-button:gradient-bg ut-button:py-2 ut-button:px-6 ut-button:rounded-xl ut-button:text-xs ut-button:mt-4"
                    />
                  </div>
                )}
              </div>
              
              {/* Back ID */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">ID Back</label>
                {idBack ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-blue-500/30 group">
                    <img src={idBack.url} alt="ID Back" className="w-full h-full object-cover" />
                    <button onClick={() => setIdBack(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative glass-dark rounded-3xl border border-white/5 overflow-hidden transition-all hover:bg-white/5">
                    <UploadDropzone 
                      endpoint="kycUploader" 
                      onClientUploadComplete={(res) => setIdBack(res[0])} 
                      className="ut-label:text-blue-400 ut-label:text-xs ut-button:cursor-pointer ut-button:gradient-bg ut-button:py-2 ut-button:px-6 ut-button:rounded-xl ut-button:text-xs ut-button:mt-4"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!idFront || !idBack}
              className="w-full h-16 rounded-2xl bg-white text-black font-black text-md flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-30 shadow-2xl shadow-white/5"
            >
              Continue to Face Match <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <div className="text-center text-white mb-2">
              <h2 className="text-2xl font-bold mb-2">Step 3: Biometric Match</h2>
              <p className="text-gray-500 text-sm italic">Perform the liveness challenges shown below.</p>
            </div>

            <FaceLiveness onCapture={(url) => setFaceSelfie(url)} isProcessing={loading} />

            <AnimatePresence>
              {faceSelfie && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="p-6 rounded-[32px] bg-green-500/5 border border-green-500/20 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <p className="text-sm text-green-500 font-bold">Liveness detected. Biometric signature captured.</p>
                  </div>
                  <button onClick={handleFinalSubmit} disabled={loading} className="w-full h-16 rounded-2xl gradient-bg text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit All Verification Data"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {step === 4 && (
          <div className="py-10 text-center space-y-8 text-white">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-600/20 rounded-[30px] flex items-center justify-center mx-auto text-blue-500 shadow-2xl shadow-blue-500/20 rotate-12">
                <ShieldAlert className="w-12 h-12 -rotate-12" />
              </div>
            </div>
            <h2 className="text-3xl font-black italic">Verification in Progress</h2>
            <p className="text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
              We've received your biometric data and legal documents. Your account will be activated once our verification is complete.
            </p>
            <button onClick={() => window.location.reload()} className="w-full py-5 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest">
              Check Status
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
