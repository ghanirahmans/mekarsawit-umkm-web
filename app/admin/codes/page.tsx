import { Suspense } from "react";
import VillageCodesClient from "./client";
import { getSessionAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function VillageCodesPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VillageCodesClient />
    </Suspense>
  );
}
