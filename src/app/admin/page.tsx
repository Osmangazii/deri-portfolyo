import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAdminSession } from "@/lib/adminAuth";

export default async function AdminPage() {
  const authed = await isAdminSession();

  if (!authed) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
