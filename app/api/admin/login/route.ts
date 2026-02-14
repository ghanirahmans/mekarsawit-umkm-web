import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  ADMIN_COOKIE_LEGACY_NAME,
  ADMIN_COOKIE_NAME,
  getSessionCookieOptions,
} from "@/lib/session";
import { logAuth } from "@/lib/logger";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    logAuth({ event: "admin-login-missing-field" });
    return NextResponse.json(
      { error: "Isi email dan password." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "super_admin" || !user.passwordHash) {
    logAuth({ event: "admin-login-forbidden", email });
    return NextResponse.json(
      { error: "Tidak punya akses admin." },
      { status: 403 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    logAuth({ event: "admin-login-wrong-password", email });
    return NextResponse.json({ error: "Password salah." }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  const cookieOptions = getSessionCookieOptions(60 * 60 * 24 * 7);

  res.cookies.set(ADMIN_COOKIE_NAME, user.id, cookieOptions);
  // Keep legacy cookie temporarily so older routes/clients stay compatible.
  res.cookies.set(ADMIN_COOKIE_LEGACY_NAME, user.id, cookieOptions);
  logAuth({ event: "admin-login-success", email, userId: user.id });

  return res;
}
