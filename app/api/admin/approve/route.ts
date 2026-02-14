import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await getSessionAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const id = formData.get("id") as string | null;
  if (!id) {
    return NextResponse.json({ error: "ID wajib" }, { status: 400 });
  }

  await prisma.business.update({
    where: { id },
    data: { verified: true, active: true },
  });

  return NextResponse.redirect(new URL("/admin/pending", req.url));
}
