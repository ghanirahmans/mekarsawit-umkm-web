import { getHeroStats, getLandingCatalog } from "@/lib/services/catalog";
import React from "react";
import Link from "next/link";

export default function HomeScreen() {
  const catalog = getLandingCatalog();
  const stats = getHeroStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fb] via-white to-[#fefbf4] text-slate-900">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-300 text-center text-lg font-bold text-slate-900 leading-[44px]">
            MS
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-700">Desa Mekar Sawit</p>
            <p className="text-sm text-slate-600">Sawit Seberang · Langkat</p>
          </div>
        </div>
        <nav className="hidden gap-4 text-sm font-semibold text-slate-700 sm:flex">
          <Link href="/katalog" className="rounded-full px-3 py-2 hover:bg-emerald-50">
            Katalog
          </Link>
          <Link href="/profil-desa" className="rounded-full px-3 py-2 hover:bg-emerald-50">
            Profil Desa
          </Link>
          <Link href="/daftar-umkm" className="rounded-full px-3 py-2 hover:bg-emerald-50">
            Daftar UMKM
          </Link>
          <Link href="/admin/login" className="rounded-full px-3 py-2 hover:bg-emerald-50">
            Admin
          </Link>
        </nav>
      </div>

      <header className="relative mx-auto max-w-6xl px-6 pb-12 pt-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-200/60 via-amber-100/60 to-transparent blur-3xl" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              UMKM Mekar Sawit · Verified by Pemdes
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Etalase digital UMKM Mekar Sawit, pesan instan via WhatsApp.
            </h1>
            <p className="text-lg text-slate-700">
              Gula semut, kopi bukit, keripik kampung, anyaman bambu. Pilih produk, klik WA, atur kirim atau jemput di titik desa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-300/40 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Lihat Katalog
              </Link>
              <Link
                href="/daftar-umkm"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Daftarkan UMKM
              </Link>
              <a
                href="https://wa.me/6281111111111?text=Halo%20admin%20desa%2C%20saya%20perlu%20bantuan%20UMKM%20Mekar%20Sawit."
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:ring-emerald-200"
              >
                Butuh Bantuan
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatChip label="UMKM aktif" value={`${stats.activeBusinesses}+`} />
              <StatChip label="Produk" value={`${stats.activeProducts}+`} />
              <StatChip label="Kategori" value={`${stats.categories}`} />
            </div>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard title="Terverifikasi" desc="Disaring dan dibina perangkat desa." />
          <FeatureCard title="Harga jelas" desc="Harga per kemasan & satuan transparan." />
          <FeatureCard title="Pesan instan" desc="Template WA otomatis ke penjual." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Katalog</p>
            <h2 className="text-3xl font-bold text-slate-900">Produk unggulan minggu ini</h2>
            <p className="text-slate-600">Klik kartu untuk chat via WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Pangan</Badge>
            <Badge>Pertanian</Badge>
            <Badge>Kerajinan</Badge>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-50 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden bg-emerald-50">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-emerald-700">Foto menyusul</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {item.stockStatus === "ready" ? "Stok siap" : "Pre-order"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-700">{item.businessCategory}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.businessName}</p>
                </div>
                <p className="text-xl font-bold text-emerald-700">
                  Rp{item.price.toLocaleString("id-ID")} <span className="text-sm font-medium text-slate-500">/ {item.unit}</span>
                </p>
                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                <div className="mt-auto flex items-center gap-2">
                  <a
                    href={item.waLink}
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500"
                  >
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-amber-100 bg-amber-50 px-6 py-8 shadow-sm sm:px-10">
          <h3 className="text-2xl font-bold text-amber-900">Daftarkan UMKM kamu</h3>
          <p className="mt-2 max-w-2xl text-amber-900/80">
            Pelaku UMKM Mekar Sawit bisa login dengan kode desa (dev: MSAWITDEV, prod: kode rotasi bulanan), verifikasi oleh admin desa, lalu tambah katalog sendiri. Pesanan tetap lewat WhatsApp.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">Kode desa + OTP nomor HP</li>
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">Admin desa approve & verifikasi</li>
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">UMKM kelola produk & foto</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-left shadow-sm">
      <p className="text-xs uppercase tracking-wide text-emerald-700">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100/70 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-semibold text-emerald-700">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">{children}</span>;
}

