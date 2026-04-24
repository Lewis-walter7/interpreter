import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import SettingsView from "@/components/dashboard/SettingsView";
import InterpreterLayout from "@/components/dashboard/InterpreterLayout";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);
  if (!rawUser) redirect("/login");

  const user = JSON.parse(JSON.stringify(rawUser));

  return (
    <InterpreterLayout user={user}>
      <div className="container mx-auto px-6">
        <SettingsView user={user} />
      </div>
    </InterpreterLayout>
  );
}
