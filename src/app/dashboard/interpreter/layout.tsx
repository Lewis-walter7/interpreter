import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InterpreterLayout from "@/components/dashboard/InterpreterLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const rawUser = await User.findById((session.user as any).id);

  if (!rawUser || rawUser.role !== "interpreter") {
    redirect("/dashboard/client"); // Correct role redirection
  }

  const user = JSON.parse(JSON.stringify(rawUser));

  return (
    <InterpreterLayout user={user}>
      {children}
    </InterpreterLayout>
  );
}
