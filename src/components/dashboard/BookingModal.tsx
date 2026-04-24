"use client";

import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Shield
} from "lucide-react";
import { createBooking } from "@/app/actions/booking";
import { toast } from "react-hot-toast";

export default function BookingModal({ 
  isOpen, 
  onClose, 
  interpreter, 
  currentUser 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  interpreter: any; 
  currentUser: any;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTimeDate = new Date(`${formData.date}T${formData.time}`);
    if (startTimeDate.getTime() < Date.now()) {
      toast.error("You cannot schedule a session in the past!");
      return;
    }

    setLoading(true);
    const endTime = new Date(startTimeDate.getTime() + 60 * 60000).toISOString(); // 1hr default

    const res = await createBooking({
      interpreterId: interpreter._id,
      clientId: currentUser.id || currentUser._id,
      startTime: startTimeDate.toISOString(),
      endTime,
      notes: formData.notes
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } else {
      toast.error(res.error || "Failed to create booking");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#010409] w-full max-w-xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-500 transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="p-20 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-green-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-green-500 border border-green-500/20">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             <h2 className="text-3xl font-black text-white mb-4">Request Sent!</h2>
             <p className="text-gray-500 max-w-xs mx-auto font-medium">We've notified {interpreter.name}. You'll receive an update once they confirm.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Branding */}
            <div className="w-full md:w-48 bg-blue-600/5 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
               <div>
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-xl mb-6">
                    {interpreter.name?.charAt(0)}
                  </div>
                  <h3 className="text-white font-bold leading-tight">{interpreter.name}</h3>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-0.5 bg-blue-500/10 rounded-full w-fit">PRO Linguist</p>
               </div>
               <div className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                  <Shield className="w-4 h-4" />
                  Secured
               </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 p-10 space-y-8">
               <div>
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Schedule Session</h2>
                  <p className="text-gray-500 text-sm font-medium">Select your preferred window for interpretation</p>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2">
                           <Calendar className="w-3 h-3" />
                           Pick Date
                        </label>
                        <input 
                           type="date" 
                           required
                           min={new Date().toISOString().split('T')[0]}
                           value={formData.date}
                           onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2">
                           <Clock className="w-3 h-3" />
                           Start Time
                        </label>
                        <input 
                           type="time" 
                           required
                           value={formData.time}
                           onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Session Notes (Optional)</label>
                     <textarea 
                        placeholder="Topics for discussion, medical context, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                     />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl gradient-bg text-white font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      REQUEST SESSION
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
               </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
