import type { Metadata } from "next";
import AdminNavbar from "../admin-navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserList from "./user-list";
import RefreshButton from "@/app/components/refresh-button";

export const metadata: Metadata = {
  title: "Kelola Pengguna",
};

import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

import SearchInput from "@/app/components/search-input";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getSessionAdmin();
  if (!user) redirect("/admin/login");

  const { q } = await searchParams;
  const query = q || "";

  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "super_admin",
      },
      OR: [
        { phone: { contains: query } },
        { email: { contains: query } },
        {
          businesses: {
            some: {
              name: { contains: query },
            },
          },
        },
      ],
    },
    include: {
      businesses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Kelola Pengguna
            </h1>
            <p className="mt-2 text-slate-600">
              Daftar semua pengguna terdaftar di sistem.
            </p>
          </div>
          <RefreshButton />
        </div>

        <div className="mb-6">
          <SearchInput placeholder="Cari user (No HP, Email, atau Nama Usaha)..." />
        </div>

        <UserList users={users} />
      </main>
    </div>
  );
}
