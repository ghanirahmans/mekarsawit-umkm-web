import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_LEGACY_NAME,
  ADMIN_COOKIE_NAME,
  getSessionCookieOptions,
} from "@/lib/session";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  const cookieOptions = getSessionCookieOptions(0);

  res.cookies.set(ADMIN_COOKIE_NAME, "", cookieOptions);
  res.cookies.set(ADMIN_COOKIE_LEGACY_NAME, "", cookieOptions);

  return res;
}
