import { NextResponse } from "next/server";
import {
  UMKM_COOKIE_NAME,
  getSessionCookieOptions,
  getStatusCookieOptions,
} from "@/lib/session";

function clearUmkmSession(req: Request) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  // Clear the UMKM session cookie
  res.cookies.set(UMKM_COOKIE_NAME, "", getSessionCookieOptions(0));
  res.cookies.set("umkm_logged_in", "", getStatusCookieOptions(0));
  return res;
}

export async function GET(req: Request) {
  return clearUmkmSession(req);
}

export async function POST(req: Request) {
  return clearUmkmSession(req);
}
