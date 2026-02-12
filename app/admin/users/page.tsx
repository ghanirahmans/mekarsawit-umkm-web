import AdminNavbar from "../admin-navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserList from "./user-list";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session } });
  if (user?.role !== "super_admin") return null;
  return user;
}

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const users = await prisma.user.findMany({
    include: {
      businesses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Admin Desa</p>
            <h2 className="text-3xl font-bold text-slate-900">
              Daftar Pengguna
            </h2>
            <p className="mt-2 text-slate-600">Kelola semua akun terdaftar.</p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm border border-slate-100">
            Total: {users.length} User
          </div>
        </div>

        <UserList users={users} />
      </main>
    </div>
  );
}
