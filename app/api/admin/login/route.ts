import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json(
      { error: "Isi email dan password." },
      { status: 400 },
    );

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "super_admin" || !user.passwordHash) {
    return NextResponse.json(
      { error: "Tidak punya akses admin." },
      { status: 403 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "Password salah." }, { status: 403 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", user.id, {
    httpOnly: true,
    secure: !!process.env.VERCEL,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
