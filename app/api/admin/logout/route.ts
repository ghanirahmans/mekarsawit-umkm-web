import { NextResponse } from "next/server";
import { ADMIN_COOKIE_LEGACY_NAME, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !!process.env.VERCEL,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  } as const;

  res.cookies.set(ADMIN_COOKIE_NAME, "", cookieOptions);
  res.cookies.set(ADMIN_COOKIE_LEGACY_NAME, "", cookieOptions);

  return res;
}
