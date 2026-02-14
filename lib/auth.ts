import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logAuth } from "@/lib/logger";

export const ADMIN_COOKIE_NAME = "admin_token";
export const ADMIN_COOKIE_LEGACY_NAME = "admin_session";

export async function getSessionUmkm() {
  const cookieStore = await cookies();
  const session = cookieStore.get("umkm_session")?.value;
  if (!session) {
    logAuth({ event: "umkm-auth-miss", umkm_session: false });
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: session } });

  if (!user) {
    logAuth({ event: "umkm-auth-user-not-found", session });
    return null;
  }

  if (user.role !== "admin_umkm") {
    logAuth({ event: "umkm-auth-role-mismatch", session, role: user.role });
    return null;
  }

  logAuth({ event: "umkm-auth-ok", session });

  return user;
}

export async function getSessionAdmin() {
  const cookieStore = await cookies();
  const session =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
    cookieStore.get(ADMIN_COOKIE_LEGACY_NAME)?.value;

  if (!session) {
    logAuth({
      event: "admin-auth-miss",
      admin_token: !!cookieStore.get(ADMIN_COOKIE_NAME)?.value,
      admin_session: !!cookieStore.get(ADMIN_COOKIE_LEGACY_NAME)?.value,
    });
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: session } });

  if (!user) {
    logAuth({ event: "admin-auth-user-not-found", session });
    return null;
  }

  if (user.role !== "super_admin") {
    logAuth({ event: "admin-auth-role-mismatch", session, role: user.role });
    return null;
  }

  logAuth({ event: "admin-auth-ok", session });

  return user;
}
