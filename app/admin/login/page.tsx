import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";
import AdminLoginClient from "./admin-login-client";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSessionAdmin();
  if (session) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginClient />;
}
