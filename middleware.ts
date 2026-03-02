import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware to protect /umkm/* and /admin/* routes.
 * Redirects unauthenticated users to the appropriate login page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect UMKM routes (except login and public API routes)
  if (pathname.startsWith("/umkm") && !pathname.startsWith("/umkm/login")) {
    const umkmSession = request.cookies.get("umkm_session")?.value;
    if (!umkmSession) {
      return NextResponse.redirect(new URL("/umkm/login", request.url));
    }
  }

  // Protect Admin routes (except login and public API routes)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminSession =
      request.cookies.get("admin_token")?.value ||
      request.cookies.get("admin_session")?.value;
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/umkm/:path*", "/admin/:path*"],
};
