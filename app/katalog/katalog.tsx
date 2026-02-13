import { getLandingCatalog } from "@/lib/services/catalog";

import Link from "next/link";
import PublicNavbar from "@/app/components/public-navbar";

export default async function KatalogPage() {
  const catalog = await getLandingCatalog();

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Navbar */}
      <PublicNavbar />

      <main className="relative pt-24 pb-20 bg-slate-50/50">
        {/* Header */}
        <header className="relative overflow-hidden bg-white px-6 py-16 text-center shadow-sm sm:py-20 mb-10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl mix-blend-multiply" />
            <div className="absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-amber-50/60 blur-3xl mix-blend-multiply" />
          </div>
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-600">
              Katalog Digital
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Produk Unggulan Desa
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 font-medium">
              Temukan berbagai produk berkualitas hasil karya warga Desa Mekar
              Sawit. Dukung ekonomi lokal dengan berbelanja langsung dari
              sumbernya.
            </p>
          </div>
        </header>

        {/* Catalog Grid */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Menampilkan{" "}
              <span className="text-slate-900">{catalog.length}</span> produk
            </p>
            {/* Filter Placeholder - Can be implemented later */}
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                <i className="bi bi-filter"></i> Filter
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                <i className="bi bi-sort-down"></i> Urutkan
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          {catalog.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mb-4 text-4xl text-slate-300">
                <i className="bi bi-basket"></i>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Belum ada produk
              </p>
              <p className="text-slate-500">
                Silakan kembali lagi nanti atau hubungi admin desa.
              </p>
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
}

// Reusing ProductCard with improved design
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
          <div className="flex h-full w-full items-center justify-center text-slate-500">
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
