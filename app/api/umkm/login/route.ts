import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { phone, password } = await req.json();
  if (!phone || !password) return NextResponse.json({ error: "Isi nomor HP dan password." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { phone } });
  
  // Check if user exists and has a password (only verified/registered ones with password can login)
  // If user registered before Phase 3, they might not have a password. 
  // For now, we assume they must re-register or admin sets it (out of scope, assume new flow).
  // Ideally, valid user must have a passwordHash.
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Akun tidak ditemukan atau belum terdaftar." }, { status: 404 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Password salah." }, { status: 403 });

  // Verify if the business is approved generally? 
  // Actually, Dashboard can show "Pending" status, so we allow login even if business is not active yet.
  // But strictly, let's allow login.

  const res = NextResponse.json({ ok: true });
  res.cookies.set("umkm_session", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
