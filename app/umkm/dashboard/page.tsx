import { getSessionUmkm } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductList from "./product-list";
import BusinessForm from "./business-form";
import UmkmNavbar from "../umkm-navbar";

export default async function UmkmDashboard() {
  const user = await getSessionUmkm();
  if (!user) redirect("/umkm/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: user.id },
    include: { products: true, owner: true },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UmkmNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {!business ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i className="bi bi-shop text-5xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Selamat Datang!
            </h2>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Akun Anda berhasil dibuat. Untuk mulai berjualan, silakan lengkapi
              profil usaha Anda terlebih dahulu.
            </p>
            <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <BusinessForm />
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Halo, {user.name || business.name || "Pelaku Usaha"} 👋
              </h2>
              <p className="mt-2 text-slate-600">
                Kelola usaha{" "}
                <span className="font-semibold text-emerald-700">
                  {business.name}
                </span>{" "}
                Anda disini.
              </p>
            </div>

            {/* Status Card */}
            <div
              className={`mb-10 rounded-3xl p-8 border ${business.verified ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${business.verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                >
                  <i
                    className={`bi ${business.verified ? "bi-patch-check-fill" : "bi-clock-history"} text-2xl`}
                  ></i>
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${business.verified ? "text-emerald-900" : "text-amber-900"}`}
                  >
                    {business.verified
                      ? "Usaha Terverifikasi"
                      : "Menunggu Verifikasi"}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${business.verified ? "text-emerald-700" : "text-amber-700"}`}
                  >
                    {business.verified
                      ? "Usaha Anda sudah aktif dan produk dapat dilihat oleh publik di katalog desa."
                      : "Data usaha Anda sedang diperiksa oleh Admin Desa. Anda tetap bisa upload produk, namun belum akan tayang di katalog publik."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Total Produk
                  </span>
                  <i className="bi bi-box-seam text-xl text-emerald-500"></i>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {business.products.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Dilihat
                  </span>
                  <i className="bi bi-eye text-xl text-blue-500"></i>
                </div>
                <p className="text-3xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-400 mt-1">Belum tersedia</p>
              </div>
            </div>

            {/* Quick Actions */}
            <h3 className="mb-6 text-lg font-bold text-slate-900">
              Aksi Cepat
            </h3>
            <div className="grid gap-6 sm:grid-cols-3 mb-12">
              <Link
                href="/umkm/products/add"
                className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md hover:ring-emerald-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <i className="bi bi-plus-lg text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Tambah Produk</h4>
                  <p className="text-xs text-slate-500">Upload jualan baru</p>
                </div>
              </Link>
              <Link
                href="/umkm/products"
                className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md hover:ring-emerald-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <i className="bi bi-list-ul text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Kelola Produk</h4>
                  <p className="text-xs text-slate-500">Lihat semua produk</p>
                </div>
              </Link>
            </div>

            {/* Recent Products Preview (Moved full list to separate page) */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Produk Terbaru
              </h3>
              <Link
                href="/umkm/products"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>
            {business.products.length > 0 ? (
              <ProductList products={business.products.slice(0, 4)} />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <p className="text-slate-500">
                  Belum ada produk yang diupload.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
