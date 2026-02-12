"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  description?: string | null;
  imageUrl?: string | null;
  business: {
    name: string;
  };
};

export default function AdminProductList({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(productId: string, action: "approve" | "reject") {
    if (
      !confirm(
        `Yakin ingin ${action === "approve" ? "menerima" : "menolak"} produk ini?`,
      )
    )
      return;

    setLoading(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setSelectedProduct(null); // Close modal on success
        router.refresh();
      } else {
        alert("Gagal memproses aksi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
          <i className="bi bi-check-circle"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Semua Beres!</h3>
        <p className="text-slate-500">
          Tidak ada produk yang menunggu verifikasi saat ini.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">UMKM</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  Rp{product.price.toLocaleString("id-ID")} / {product.unit}
                </td>
                <td className="px-6 py-4 text-emerald-700 font-medium">
                  {product.business.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-600"
                  >
                    Overview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative aspect-video bg-slate-100">
              {selectedProduct.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <i className="bi bi-image text-4xl"></i>
                  <span className="ml-2 font-medium">Tidak ada foto</span>
                </div>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm font-bold text-emerald-600">
                  {selectedProduct.business.name}
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {selectedProduct.description || "Tidak ada deskripsi."}
                </p>
                <div className="mt-4 inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  Rp{selectedProduct.price.toLocaleString("id-ID")} /{" "}
                  {selectedProduct.unit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleAction(selectedProduct.id, "reject")}
                  disabled={loading === selectedProduct.id}
                  className="rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
                >
                  Tolak
                </button>
                <button
                  onClick={() => handleAction(selectedProduct.id, "approve")}
                  disabled={loading === selectedProduct.id}
                  className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {loading === selectedProduct.id ? "Memproses..." : "Terima"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
