"use client";

import { useState } from "react";
import { User as UserIcon, Mail, Phone, Camera, Save, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/app/actions/user";

export default function ClientSettings({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState(initialUser);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateProfile({
        name: user.name,
        phoneNumber: user.phoneNumber,
        image: user.image
      });

      if (res.success) {
        toast.success("Profile updated successfully", {
          style: { borderRadius: '16px', background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        });
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/client"
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
            <p className="text-gray-500 text-sm font-medium">Manage your personal information and preferences.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-dark p-8 rounded-[40px] border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 blur-[60px] -z-10" />

            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-3xl gradient-bg p-1">
                <div className="w-full h-full rounded-[20px] bg-[#020617] overflow-hidden flex items-center justify-center text-4xl font-black text-white">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-xl text-white mb-1">{user.name}</h3>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 inline-block px-3 py-1 rounded-full border border-blue-500/20">Client Member</p>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Member Since</span>
                <span className="text-white font-bold">{new Date(user.createdAt).getFullYear()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Account Status</span>
                <span className="text-green-500 font-bold flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="glass-dark p-8 md:p-10 rounded-[40px] border border-white/5 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3 text-blue-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-gray-500 cursor-not-allowed opacity-60 font-medium"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3 text-blue-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={user.phoneNumber || ""}
                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-3 h-3 text-blue-500" />
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    value={user.image || ""}
                    onChange={(e) => setUser({ ...user, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-fit px-12 py-5 gradient-bg rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save My Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-[32px] border border-red-500/5 bg-red-500/5 space-y-4">
              <div>
                <h4 className="text-red-500 font-bold text-sm mb-1 uppercase tracking-tight">Danger Zone</h4>
                <p className="text-gray-500 text-xs">Permanently delete your account and all your data.</p>
              </div>
              <button type="button" className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all border border-red-500/20">
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
