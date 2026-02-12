import AdminNavbar from "../admin-navbar";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminProductList from "./product-list";

export default async function AdminProductsPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const pendingProducts = await prisma.product.findMany({
    where: {
      verified: false,
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
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">Admin Desa</p>
          <h2 className="text-3xl font-bold text-slate-900">
            Verifikasi Produk
          </h2>
          <p className="mt-2 text-slate-600">
            Daftar produk baru yang menunggu persetujuan untuk ditampilkan di
            katalog ({pendingProducts.length} menunggu verifikasi).
          </p>
        </div>

        <AdminProductList initialProducts={pendingProducts} />
      </main>
    </div>
  );
}
