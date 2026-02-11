import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, code } = await req.json();
  if (!email || !password || !code) return NextResponse.json({ error: "Isi email, password, dan kode." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "super_admin" || !user.passwordHash) {
    return NextResponse.json({ error: "Tidak punya akses admin." }, { status: 403 });
  }

  const validCode = await prisma.villageCode.findFirst({ where: { code, isActive: true } });
  if (!validCode) {
    return NextResponse.json({ error: "Kode desa tidak valid / tidak aktif." }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Password salah." }, { status: 403 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
  return res;
}
