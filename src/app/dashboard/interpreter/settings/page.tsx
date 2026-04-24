import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import InterpreterSettings from "@/components/dashboard/InterpreterSettings";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "interpreter") {
    redirect("/login");
  }

  await dbConnect();
  const user = await User.findById((session.user as any).id).lean();

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Expert Profile Settings</h1>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest italic">Maintain your professional identity and linguistic credentials.</p>
      </div>

      <InterpreterSettings user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
