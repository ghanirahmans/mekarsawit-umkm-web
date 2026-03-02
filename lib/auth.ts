import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logAuth } from "@/lib/logger";
import {
  ADMIN_COOKIE_LEGACY_NAME,
  ADMIN_COOKIE_NAME,
  UMKM_COOKIE_NAME,
} from "@/lib/session";

const LOG_AUTH_SUCCESS = process.env.LOG_AUTH_SUCCESS === "1";

export async function getSessionUmkm() {
  const cookieStore = await cookies();
  const session = cookieStore.get(UMKM_COOKIE_NAME)?.value;
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

  if (LOG_AUTH_SUCCESS) {
    logAuth({ event: "umkm-auth-ok", session });
  }

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

  if (LOG_AUTH_SUCCESS) {
    logAuth({ event: "admin-auth-ok", session });
  }

  return user;
}
