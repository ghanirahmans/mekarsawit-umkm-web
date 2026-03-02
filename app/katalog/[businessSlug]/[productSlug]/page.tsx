import type { Metadata } from "next";
import { getProductDetail } from "@/lib/services/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicNavbar from "@/app/components/public-navbar";
import ViewTracker from "@/app/components/view-tracker";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ businessSlug: string; productSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug, productSlug } = await params;
  const data = await getProductDetail(businessSlug, productSlug);
  if (!data) return { title: "Produk Tidak Ditemukan" };
  return {
    title: `${data.product.name} — ${data.business.name}`,
    description:
      data.product.description ||
      `${data.product.name} dari ${data.business.name}. Pesan sekarang!`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { businessSlug, productSlug } = await params;
  const data = await getProductDetail(businessSlug, productSlug);
  if (!data) notFound();

  const { product, business, otherProducts, waLink } = data;

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      <PublicNavbar />

      <main className="relative pt-24 pb-20 bg-slate-50/50">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-5xl px-6 mb-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link
              href="/katalog"
              className="hover:text-emerald-600 transition-colors"
            >
              Katalog
            </Link>
            <i className="bi bi-chevron-right text-[10px]"></i>
            <span className="text-slate-400 truncate max-w-[200px]">
              {business.name}
            </span>
            <i className="bi bi-chevron-right text-[10px]"></i>
            <span className="text-slate-900 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Product Section */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                  <i className="bi bi-image text-7xl"></i>
                  <p className="mt-2 text-sm font-medium">Belum ada foto</p>
                </div>
              )}
              <div className="absolute right-4 top-4 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm shadow-sm ring-1 ring-slate-100">
                {product.stockStatus === "ready" ? (
                  <span className="text-emerald-600">
                    <i className="bi bi-check-circle-fill mr-1"></i>Ready Stock
                  </span>
                ) : (
                  <span className="text-amber-600">
                    <i className="bi bi-clock-fill mr-1"></i>Pre-Order
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                  <i className="bi bi-tag-fill text-[10px]"></i>
                  {business.category}
                </span>

                {/* Product Name */}
                <h1 className="mt-4 text-3xl font-extrabold text-slate-900 leading-tight sm:text-4xl">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-emerald-600">
                    Rp{product.price.toLocaleString("id-ID")}
                  </p>
                  <span className="text-base font-semibold text-slate-400">
                    / {product.unit}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Deskripsi Produk
                    </h3>
                    <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Business Card */}
                <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      {business.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={business.coverImageUrl}
                          alt={business.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <i className="bi bi-shop text-2xl text-emerald-600"></i>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">
                        {business.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 truncate">
                        <i className="bi bi-person-fill mr-1"></i>
                        {business.ownerName || "Pemilik UMKM"}
                      </p>
                      {business.address && (
                        <p className="text-xs font-medium text-slate-400 truncate mt-0.5">
                          <i className="bi bi-geo-alt-fill mr-1"></i>
                          {business.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 space-y-3">
                <Link
                  href={waLink}
                  target="_blank"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 active:scale-[0.99]"
                >
                  <i className="bi bi-whatsapp text-xl"></i>
                  Pesan via WhatsApp
                </Link>
                <Link
                  href="/katalog"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                >
                  <i className="bi bi-arrow-left"></i>
                  Kembali ke Katalog
                </Link>
              </div>
            </div>
          </div>

          {/* Other Products */}
          {otherProducts.length > 0 && (
            <section className="mt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Produk Lainnya dari{" "}
                    <span className="text-emerald-700">{business.name}</span>
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 font-medium">
                    Lihat lebih banyak produk dari UMKM ini
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {otherProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/katalog/${business.slug}/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-lg hover:ring-emerald-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100 border-b border-slate-100">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <i className="bi bi-image text-3xl"></i>
                        </div>
                      )}
                      <div className="absolute right-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm shadow-sm ring-1 ring-slate-100">
                        {p.stockStatus === "ready" ? "Ready" : "PO"}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-bold text-slate-900">
                          Rp{p.price.toLocaleString("id-ID")}
                        </p>
                        <span className="text-xs font-semibold text-slate-500">
                          / {p.unit}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Track view for this business */}
        <ViewTracker businessIds={[business.id]} />
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
