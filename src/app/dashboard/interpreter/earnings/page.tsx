import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Call from "@/models/Call";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InterpreterLayout from "@/components/dashboard/InterpreterLayout";
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);
  if (!rawUser || rawUser.role !== "interpreter") redirect("/dashboard");
  
  const user = JSON.parse(JSON.stringify(rawUser));

  // Fetch all completed calls for calculation
  const rawCalls = await Call.find({ interpreterId: user.id || user._id })
    .sort({ createdAt: -1 });
  const calls = JSON.parse(JSON.stringify(rawCalls));

  const totalEarned = calls.reduce((acc: number, call: any) => {
      // Calculate based on duration and hourly rate (default to 40 if not set)
      const ratePerMinute = (user.interpreterData?.hourlyRate || 40) / 60;
      return acc + (call.duration * ratePerMinute);
  }, 0);

  return (
    <InterpreterLayout user={user}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Earnings Ledger</h1>
            <p className="text-gray-500 font-medium">Track your revenue and financial performance</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold text-sm">
              Statement Export
            </button>
            <button className="px-6 py-3 gradient-bg text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm">
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-dark p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -z-10 group-hover:bg-blue-500/20 transition-all" />
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <Wallet className="w-7 h-7" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-black text-white">${(user.interpreterData?.balance || 0).toFixed(2)}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>Ready for withdrawal</span>
            </div>
          </div>

          <div className="glass-dark p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -z-10 group-hover:bg-purple-500/20 transition-all" />
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <TrendingUp className="w-7 h-7" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
            <h2 className="text-4xl font-black text-white">${totalEarned.toFixed(2)}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-400">
              <span>Accumulated across all sessions</span>
            </div>
          </div>

          <div className="glass-dark p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -z-10 group-hover:bg-emerald-500/20 transition-all" />
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
              <DollarSign className="w-7 h-7" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active Rate</p>
            <h2 className="text-4xl font-black text-white">${user.interpreterData?.hourlyRate || 40}.00<span className="text-lg font-medium text-gray-500">/hr</span></h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span>Standard Video Interpretation</span>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
             <h2 className="text-xl font-black text-white flex items-center gap-3">
               <Clock className="w-6 h-6 text-blue-500" />
               Payment History
             </h2>
             <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
               <CalendarIcon className="w-4 h-4" />
               Current Month
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="px-10 py-6">Reference</th>
                  <th className="px-10 py-6">Date</th>
                  <th className="px-10 py-6">Duration</th>
                  <th className="px-10 py-6">Amount</th>
                  <th className="px-10 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calls.map((call: any, i: number) => {
                  const ratePerMinute = (user.interpreterData?.hourlyRate || 40) / 60;
                  const amount = call.duration * ratePerMinute;
                  return (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6">
                        <span className="text-sm font-bold text-white block">#{call._id.toString().slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Session Payment</span>
                      </td>
                      <td className="px-10 py-6 text-sm text-gray-400">
                         {new Date(call.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6 text-sm text-gray-400 font-mono">
                        {call.duration}m
                      </td>
                      <td className="px-10 py-6 text-sm font-extrabold text-white">
                        +${amount.toFixed(2)}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-[10px] font-black uppercase px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                          Credited
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {calls.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No earnings yet</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto font-light">Complete your first session to start building your revenue history.</p>
            </div>
          )}
        </div>
      </div>
    </InterpreterLayout>
  );
}
