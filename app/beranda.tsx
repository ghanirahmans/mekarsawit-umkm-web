import { getHeroStats, getLandingCatalog } from "@/lib/services/catalog";
import React from "react";
import Link from "next/link";

export default async function HomeScreen() {
  const catalog = await getLandingCatalog();
  const stats = await getHeroStats();

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/50 bg-white/90 backdrop-blur-md transition-all shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-emerald-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo Desa Mekar Sawit"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Desa Mekar Sawit
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                Langkat, Sumatera Utara
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <NavLink href="/katalog">Katalog</NavLink>
            <NavLink href="/profil-desa">Profil Desa</NavLink>
            <NavLink href="/daftar-umkm">Gabung UMKM</NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/umkm/login"
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
            >
              Masuk
            </Link>
            <Link
              href="/daftar-umkm"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 hover:shadow-emerald-500/30"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:pt-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl mix-blend-multiply" />
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl opacity-60 mix-blend-multiply" />
          </div>

          <div className="mx-auto max-w-7xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse mr-2"></span>
              <span className="text-xs font-semibold text-emerald-900">
                Platform Resmi UMKM Desa
              </span>
            </div>

            <h2 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl drop-shadow-sm">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 pb-2">
                Potensi Lokal,
              </span>
              <span className="block relative z-10 text-slate-900">
                Kualitas Global.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-700 sm:text-xl">
              Jelajahi ragam produk asli dari tangan-tangan terampil warga Desa
              Mekar Sawit. Mulai dari kuliner lezat hingga kerajinan tangan yang
              memikat.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20 active:scale-95"
              >
                Belanja Sekarang
                <i className="bi bi-arrow-right"></i>
              </Link>
              <Link
                href="/daftar-umkm"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-800 transition-all hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
              >
                Pelajari Cara Gabung
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-y border-slate-200 py-8 sm:grid-cols-4 bg-white/50 backdrop-blur-sm rounded-xl">
              <StatItem
                label="UMKM Terdaftar"
                value={stats.activeBusinesses}
                suffix="+"
              />
              <StatItem
                label="Produk Lokal"
                value={stats.activeProducts}
                suffix="+"
              />
              <StatItem label="Kategori" value={stats.categories} suffix="" />
              <StatItem label="Kecamatan" value="Sawit Seberang" suffix="" />
            </div>
          </div>
        </section>

        {/* Features/Values */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <FeatureCard
                icon="bi-patch-check-fill"
                color="text-emerald-600"
                title="Terverifikasi Desa"
                desc="Setiap produk yang tampil telah melalui proses kurasi dan verifikasi oleh tim desa untuk menjamin kualitas."
              />
              <FeatureCard
                icon="bi-whatsapp"
                color="text-green-600"
                title="Transaksi Mudah"
                desc="Hubungi penjual langsung via WhatsApp. Tanpa perantara, tanpa biaya admin tambahan."
              />
              <FeatureCard
                icon="bi-heart-fill"
                color="text-red-600"
                title="Dukung Tetangga"
                desc="Setiap rupiah yang Anda belanjakan berputar kembali untuk membangun ekonomi warga sekitar."
              />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-slate-50 py-24 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold text-slate-900">
                  Produk Pilihan
                </h3>
                <p className="mt-2 text-slate-700 font-medium">
                  Rekomendasi terbaik minggu ini, langsung dari dapur dan
                  bengkel produksi warga.
                </p>
              </div>
              <Link
                href="/katalog"
                className="group flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Lihat Semua
                <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.slice(0, 4).map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-slate-900 px-6 py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-emerald-400 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-amber-400 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-5xl drop-shadow-lg">
              Punya Usaha di Mekar Sawit?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-200 font-medium">
              Jangkau lebih banyak pelanggan dengan bergabung di platform desa
              digital. Gratis, mudah, dan didukung penuh oleh pemerintah desa.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/daftar-umkm"
                className="rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 active:scale-95"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/kontak"
                className="rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95 border border-white/20"
              >
                Tanya Dulu
              </Link>
              <Link
                href="https://wa.me/6281111111111"
                target="_blank"
                className="rounded-full bg-green-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 active:scale-95 flex items-center gap-2"
              >
                <i className="bi bi-whatsapp"></i>
                Hubungi Admin
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 text-sm text-slate-300 sm:grid-cols-3 font-medium">
              <div className="flex items-center justify-center gap-2">
                <i className="bi bi-check-circle-fill text-emerald-400"></i>
                Gratis Biaya Daftar
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="bi bi-check-circle-fill text-emerald-400"></i>
                Promosi Otomatis
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="bi bi-check-circle-fill text-emerald-400"></i>
                Bimbingan Digital
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-600 font-medium">
          <p>
            © {new Date().getFullYear()} Pemerintah Desa Mekar Sawit. Dilindungi
            Undang-Undang.
          </p>
          <p className="mt-2">
            Dibuat oleh{" "}
            <span className="font-bold text-emerald-700">
              Tim Mekar Sawit Beraksi UMSU
            </span>{" "}
            untuk kemajuan desa.
          </p>
        </footer>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-700"
    >
      {children}
    </Link>
  );
}

function StatItem({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | string;
  suffix: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-slate-900 sm:text-4xl">
        {value}
        {suffix}
      </span>
      <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-600">
        {label}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  color,
  title,
  desc,
}: {
  icon: string;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-slate-50/50 p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100">
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${color} text-2xl group-hover:ring-emerald-100`}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
        {title}
      </h3>
      <p className="leading-relaxed text-slate-700 font-medium">{desc}</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductCard({ item }: { item: any }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-lg hover:ring-emerald-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100 border-b border-slate-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <i className="bi bi-image text-3xl"></i>
          </div>
        )}
        <div className="absolute right-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm shadow-sm ring-1 ring-slate-100">
          {item.stockStatus === "ready" ? "Ready" : "PO"}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          {item.businessCategory}
        </p>
        <h3 className="mt-1 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs font-medium text-slate-600">
          {item.businessName}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">
            Rp{item.price.toLocaleString("id-ID")}
          </p>
          <span className="text-xs font-semibold text-slate-500">
            / {item.unit}
          </span>
        </div>

        <Link
          href={item.waLink}
          target="_blank"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-100 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:border-emerald-600 hover:text-white hover:shadow-md hover:shadow-emerald-200"
        >
          <i className="bi bi-whatsapp"></i>
          Pesan
        </Link>
      </div>
    </div>
  );
}
