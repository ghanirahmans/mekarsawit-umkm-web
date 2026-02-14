import { NextResponse } from "next/server";

function clearUmkmSession(req: Request) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  // Clear the umkm_session cookie
  res.cookies.set("umkm_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !!process.env.VERCEL,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(req: Request) {
  return clearUmkmSession(req);
}

export async function POST(req: Request) {
  return clearUmkmSession(req);
}
