import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ClientSettings from "@/components/dashboard/ClientSettings";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "client") {
    redirect("/login");
  }

  await dbConnect();
  const user = await User.findById((session.user as any).id).lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <ClientSettings user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
