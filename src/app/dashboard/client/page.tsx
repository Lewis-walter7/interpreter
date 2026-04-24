import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { getClientBookings } from "@/app/actions/booking";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  if ((session.user as any).role !== "client") {
    redirect("/dashboard");
  }

  const userId = (session.user as any).id || (session.user as any)._id;
  const bookings = await getClientBookings(userId);

  return <ClientDashboard user={session.user} initialBookings={bookings} />;
}
