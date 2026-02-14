import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSessionUmkm() {
  const cookieStore = await cookies();
  const session = cookieStore.get("umkm_session")?.value;
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session } });
  // Ensure strict role check if needed, but 'admin_umkm' is the role
  if (user?.role !== "admin_umkm") return null;
  return user;
}

export async function getSessionAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  console.log(
    "[getSessionAdmin] cookie admin_session:",
    session ?? "NOT FOUND",
  );
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session } });
  console.log(
    "[getSessionAdmin] user found:",
    user?.id ?? "null",
    "role:",
    user?.role ?? "none",
  );
  if (user?.role !== "super_admin") return null;

  return user;
}
