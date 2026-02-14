import type { Metadata } from "next";
import AdminNavbar from "../admin-navbar";
import { getSessionAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import RefreshButton from "@/app/components/refresh-button";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  // Fetch Stats
  const [
    totalUsers,
    pendingBusinesses,
    activeBusinesses,
    pendingProducts,
    activeProducts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.business.count({ where: { verified: false } }),
    prisma.business.count({ where: { verified: true } }),
    prisma.product.count({ where: { verified: false } }),
    prisma.product.count({ where: { verified: true } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Selamat Datang, {admin.name || "Admin"}! 👋
          </h2>
          <p className="mt-2 text-slate-600">
            Berikut adalah ringkasan aktivitas dan panduan sistem Mekarsawit.
          </p>
        </div>
        {/* System Flow (Infographic style) */}
        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            🔄 Alur Kerja Sistem
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {[
              {
                step: "1",
                icon: "bi-person-plus-fill",
                title: "Warga Daftar",
                desc: "Warga membuat akun UMKM.",
              },
              {
                step: "2",
                icon: "bi-shop",
                title: "Input Usaha",
                desc: "Warga mengisi profil usaha.",
              },
              {
                step: "3",
                icon: "bi-patch-check-fill",
                title: "Verifikasi UMKM",
                desc: "Admin memvalidasi data usaha.",
                action: "Lihat Pending",
                link: "/admin/pending",
              },
              {
                step: "4",
                icon: "bi-box-seam",
                title: "Upload Produk",
                desc: "UMKM menambah produk jualan.",
              },
              {
                step: "5",
                icon: "bi-bag-check-fill",
                title: "Verifikasi Produk",
                desc: "Admin menyetujui produk tayang.",
                action: "Lihat Produk",
                link: "/admin/products",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl text-emerald-600 shadow-sm ring-1 ring-slate-100">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                {item.action && (
                  <Link
                    href={item.link}
                    className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    {item.action}
                  </Link>
                )}
                {/* Connector Line (Desktop) */}
                {idx < 4 && (
                  <div className="absolute top-7 -right-[50%] hidden h-0.5 w-full bg-slate-100 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Statistik Terkini
          </h3>
          <RefreshButton />
        </div>
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">
                Total UMKM Aktif
              </span>
              <i className="bi bi-shop text-xl text-emerald-500"></i>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {activeBusinesses}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">
                Produk Tayang
              </span>
              <i className="bi bi-box-seam text-xl text-blue-500"></i>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {activeProducts}
            </p>
          </div>
          <Link
            href="/admin/pending"
            className="group rounded-2xl bg-orange-50 p-6 ring-1 ring-orange-100 transition hover:bg-orange-100"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-orange-700">
                Pending UMKM
              </span>
              <i className="bi bi-exclamation-circle-fill text-xl text-orange-500"></i>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {pendingBusinesses}
            </p>
            <span className="mt-2 inline-block text-xs font-medium text-orange-600 group-hover:underline">
              Perlu Verifikasi →
            </span>
          </Link>
          <Link
            href="/admin/products"
            className="group rounded-2xl bg-purple-50 p-6 ring-1 ring-purple-100 transition hover:bg-purple-100"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-purple-700">
                Pending Produk
              </span>
              <i className="bi bi-tags-fill text-xl text-purple-500"></i>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {pendingProducts}
            </p>
            <span className="mt-2 inline-block text-xs font-medium text-purple-600 group-hover:underline">
              Perlu Verifikasi →
            </span>
          </Link>
        </div>
        {/* Quick Actions */}
        <h3 className="mb-6 text-lg font-bold text-slate-900">Aksi Cepat</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <Link
            href="/admin/pending"
            className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <i className="bi bi-check-lg text-2xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Verifikasi UMKM</h4>
              <p className="text-xs text-slate-500">Validasi pendaftar baru</p>
            </div>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <i className="bi bi-bag-check text-2xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Verifikasi Produk</h4>
              <p className="text-xs text-slate-500">
                Cek produk sebelum tayang
              </p>
            </div>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <i className="bi bi-people text-2xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Kelola User</h4>
              <p className="text-xs text-slate-500">Lihat semua pengguna</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
