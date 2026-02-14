export const UMKM_COOKIE_NAME = "umkm_session";
export const ADMIN_COOKIE_NAME = "admin_token";
export const ADMIN_COOKIE_LEGACY_NAME = "admin_session";

export function getSessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !!process.env.VERCEL,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function getStatusCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production" && !!process.env.VERCEL,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
