import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  // Clear the umkm_session cookie
  res.cookies.set("umkm_session", "", {
    httpOnly: true,
    secure: !!process.env.VERCEL,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
