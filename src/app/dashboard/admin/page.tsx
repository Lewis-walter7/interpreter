import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  if ((session.user as any).role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminDashboard />;
}
