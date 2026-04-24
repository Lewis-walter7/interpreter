import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InterpreterLayout from "@/components/dashboard/InterpreterLayout";
import { 
  Settings
} from "lucide-react";

import { getInterpreterBookings } from "@/app/actions/booking";
import ScheduleManager from "@/components/dashboard/ScheduleManager";

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);
  if (!rawUser || rawUser.role !== "interpreter") redirect("/dashboard");
  
  const user = JSON.parse(JSON.stringify(rawUser));
  const bookings = await getInterpreterBookings(user.id || user._id);

  return (
    <InterpreterLayout user={user}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Service Schedule</h1>
            <p className="text-gray-500 font-medium">Manage your weekly availability and booked sessions</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Slot Settings
            </button>
          </div>
        </div>

        <ScheduleManager initialBookings={bookings} interpreterId={user.id || user._id} />
      </div>
    </InterpreterLayout>
  );
}
