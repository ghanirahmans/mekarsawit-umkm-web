import { getLandingCatalog } from "@/lib/services/catalog";
import Link from "next/link";

export default function KatalogPage() {
  const catalog = getLandingCatalog();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7f2] via-white to-[#fefbf5] text-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 pb-6">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Katalog UMKM</p>
          <h1 className="text-3xl font-bold text-slate-900">Produk unggulan Mekar Sawit</h1>
          <p className="text-slate-600">Klik kartu untuk chat via WhatsApp.</p>
        </div>
        <Link
          href="/"
          className="hidden rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 sm:inline-flex"
        >
          ← Beranda
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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
              <p className="text-xl font-bold text-emerald-800">
                Rp{item.price.toLocaleString("id-ID")} <span className="text-sm font-medium text-slate-500">/ {item.unit}</span>
              </p>
              <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
              <div className="mt-auto flex items-center gap-2">
                <a
                  href={item.waLink}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
