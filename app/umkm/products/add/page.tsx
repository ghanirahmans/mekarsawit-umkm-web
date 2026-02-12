"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UmkmNavbar from "../../umkm-navbar";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Pcs");
  const [customUnit, setCustomUnit] = useState("");
  const [stockStatus, setStockStatus] = useState("ready");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const unitOptions = [
    "Pcs",
    "Kg",
    "Gram",
    "Liter",
    "Bungkus",
    "Pack",
    "Botol",
    "Lusin",
    "Kodi",
    "Porsi",
    "Lainnya",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("Ukuran gambar maksimal 2MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("unit", unit === "Lainnya" ? customUnit : unit);
      formData.append("stockStatus", stockStatus);
      formData.append("description", description);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const res = await fetch("/api/umkm/products", {
        method: "POST",
        body: formData, // Auto-sets Content-Type to multipart/form-data
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah produk.");

      router.push("/umkm/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UmkmNavbar />
      <main className="mx-auto max-w-7xl p-6">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
            <Link
              href="/umkm/dashboard"
              className="text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Batal
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload - Prominent at top */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group h-48 w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <i className="bi bi-camera-fill text-2xl"></i>
                    </div>
                    <p className="text-sm font-semibold group-hover:text-emerald-600">
                      Klik untuk upload foto produk
                    </p>
                    <p className="text-xs text-slate-400">Maksimal 2MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Nama Produk
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Keripik Pisang Original"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Harga (Rp)
                </label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition pl-10"
                  />
                  <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Satuan
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                >
                  {unitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {unit === "Lainnya" && (
                  <input
                    required
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    placeholder="Tulis satuan..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Status Stok
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="ready">Ready Stock</option>
                <option value="preorder">Pre-Order (PO)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Deskripsi (Opsional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan keunggulan produk Anda..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
