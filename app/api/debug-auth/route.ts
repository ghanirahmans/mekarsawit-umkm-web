import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map((c) => {
      const { value, ...rest } = c;
      return {
        ...rest,
        value: `${value.substring(0, 3)}...${value.slice(-3)} (len: ${value.length})`,
      };
    });

    const adminSession = await getSessionAdmin();

    return NextResponse.json({
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
      },
      cookies: allCookies,
      session: {
        isAuthenticated: !!adminSession,
        adminId: adminSession?.id,
        role: adminSession?.role,
      },
      headers: {
        cookie: req.headers.get("cookie") ? "present" : "missing",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Debug failed", details: String(error) },
      { status: 500 },
    );
  }
}
