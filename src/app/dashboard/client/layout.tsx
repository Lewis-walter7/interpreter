import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLayout from "@/components/dashboard/ClientLayout";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <ClientLayout user={JSON.parse(JSON.stringify(user))}>
      {children}
    </ClientLayout>
  );
}
