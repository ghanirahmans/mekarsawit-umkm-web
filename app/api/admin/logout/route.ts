import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL("/admin/login", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set("admin_session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
