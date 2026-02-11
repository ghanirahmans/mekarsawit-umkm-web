import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getAdmin() {
  const session = cookies().get("admin_session")?.value;
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session } });
  if (user?.role !== "super_admin") return null;
  return user;
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const id = formData.get("id") as string | null;
  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 });

  await prisma.business.update({ where: { id }, data: { verified: true, active: true } });
  return NextResponse.redirect(new URL("/admin/pending", req.url));
}
