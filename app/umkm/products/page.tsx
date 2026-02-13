import UmkmNavbar from "../umkm-navbar";
import { getSessionUmkm } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductList from "../dashboard/product-list";
import Link from "next/link";
import RefreshButton from "@/app/components/refresh-button";

export default async function UmkmProductListPage() {
  const user = await getSessionUmkm();
  if (!user) redirect("/umkm/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: user.id },
    include: { products: true, owner: true },
  });

  if (!business) redirect("/umkm/dashboard");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UmkmNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Produk Saya</h1>
            <p className="mt-2 text-slate-600">
              Kelola daftar produk yang ditampilkan di katalog desa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RefreshButton />
            <Link
              href="/umkm/products/add"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30"
            >
              <i className="bi bi-plus-lg"></i>
              Tambah Produk Baru
            </Link>
          </div>
        </div>

        {business.products.length > 0 ? (
          <ProductList products={business.products} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="mb-6 h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <i className="bi bi-box-seam text-4xl"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Belum ada produk
            </h2>
            <p className="mt-2 max-w-md text-slate-500">
              Anda belum menambahkan produk apapun. Mulai tambahkan produk agar
              muncul di katalog desa.
            </p>
            <Link
              href="/umkm/products/add"
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
            >
              Tambah Produk Pertama
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
