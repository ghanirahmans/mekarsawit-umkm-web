import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { normalizePhoneNumber } from "@/lib/wa";
import { logAuth } from "@/lib/logger";
import {
  UMKM_COOKIE_NAME,
  getSessionCookieOptions,
  getStatusCookieOptions,
} from "@/lib/session";

export async function POST(req: Request) {
  const { phone: rawPhone, password } = await req.json();
  if (!rawPhone || !password) {
    logAuth({ event: "umkm-login-missing-field" });
    return NextResponse.json(
      { error: "Isi nomor HP dan password." },
      { status: 400 },
    );
  }

  const phone = normalizePhoneNumber(rawPhone);
  const user = await prisma.user.findUnique({ where: { phone } });

  // Check if user exists and has a password (only verified/registered ones with password can login)
  // If user registered before Phase 3, they might not have a password.
  // For now, we assume they must re-register or admin sets it (out of scope, assume new flow).
  // Ideally, valid user must have a passwordHash.
  if (!user || !user.passwordHash) {
    logAuth({ event: "umkm-login-user-not-found", phone });
    return NextResponse.json(
      { error: "Akun tidak ditemukan atau belum terdaftar." },
      { status: 404 },
    );
  }

  if (user.role !== "admin_umkm") {
    logAuth({ event: "umkm-login-role-mismatch", phone, role: user.role });
    return NextResponse.json(
      { error: "Akun ini bukan akun UMKM." },
      { status: 403 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    logAuth({ event: "umkm-login-wrong-password", phone });
    return NextResponse.json({ error: "Password salah." }, { status: 403 });
  }

  // Verify if the business is approved generally?
  // Actually, Dashboard can show "Pending" status, so we allow login even if business is not active yet.
  // But strictly, let's allow login.

  const res = NextResponse.json({ ok: true });
  const ttl = 60 * 60 * 24 * 7;
  res.cookies.set(UMKM_COOKIE_NAME, user.id, getSessionCookieOptions(ttl));
  res.cookies.set("umkm_logged_in", "1", getStatusCookieOptions(ttl));
  logAuth({ event: "umkm-login-success", phone, userId: user.id });
  return res;
}
