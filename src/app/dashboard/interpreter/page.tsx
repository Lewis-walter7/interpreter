export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InterpreterLayout from "@/components/dashboard/InterpreterLayout";
import KYCOnboarding from "@/components/dashboard/KYCOnboarding";
import RealTimeDashboard from "@/components/dashboard/RealTimeDashboard";
import Call from "@/models/Call";

export default async function InterpreterDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);

  if (!rawUser || rawUser.role !== "interpreter") {
    redirect("/dashboard");
  }

  // Convert Mongoose document to a plain POJO (Plain Old JavaScript Object)
  const user = JSON.parse(JSON.stringify(rawUser));
  const isVerified = user.interpreterData?.status === "verified";

  // Fetch Session History
  const rawCalls = await Call.find({ interpreterId: user._id })
    .sort({ createdAt: -1 })
    .limit(10);
  const calls = JSON.parse(JSON.stringify(rawCalls));

  return (
    <InterpreterLayout user={user}>
      {!isVerified ? (
        <KYCOnboarding user={user} />
      ) : (
        <RealTimeDashboard user={user} initialCalls={calls} />
      )}
    </InterpreterLayout>
  );
}
