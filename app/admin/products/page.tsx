import type { Metadata } from "next";
import AdminNavbar from "../admin-navbar";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminProductList from "./product-list";
import RefreshButton from "@/app/components/refresh-button";

export const metadata: Metadata = {
  title: "Verifikasi Produk",
};

export const dynamic = "force-dynamic";

import SearchInput from "@/app/components/search-input";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const { q } = await searchParams;
  const query = q || "";

  const pendingProducts = await prisma.product.findMany({
    where: {
      verified: false,
      OR: [
        { name: { contains: query } },
        { business: { name: { contains: query } } },
      ],
    },
    include: {
      business: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Verifikasi Produk
            </h1>
            <p className="mt-2 text-slate-600">
              Daftar produk baru yang perlu disetujui sebelum tayang.
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Cari produk atau nama UMKM..." />
          <RefreshButton />
        </div>

        <AdminProductList initialProducts={pendingProducts} />
      </main>
    </div>
  );
}
