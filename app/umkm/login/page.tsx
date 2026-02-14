import { redirect } from "next/navigation";
import { getSessionUmkm } from "@/lib/auth";
import UmkmLoginClient from "./umkm-login-client";

export const dynamic = "force-dynamic";

export default async function UmkmLoginPage() {
  const session = await getSessionUmkm();
  if (session) {
    redirect("/umkm/dashboard");
  }

  return <UmkmLoginClient />;
}
