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
        setImageFile(null);
        setPreviewUrl("");
        e.target.value = "";
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
      if (!imageFile) {
        throw new Error("Foto produk wajib diisi.");
      }

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
        credentials: "include",
        cache: "no-store",
        body: formData, // Auto-sets Content-Type to multipart/form-data
      });

      let data: { error?: string } | null = null;
      try {
        data = (await res.json()) as { error?: string };
      } catch {
        data = null;
      }

      if (res.status === 401) {
        router.push("/umkm/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Gagal menambah produk.");
      }

      router.push("/umkm/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof TypeError
          ? "Tidak bisa terhubung ke server. Coba refresh halaman lalu ulangi."
          : err instanceof Error
            ? err.message
            : "Gagal menambah produk.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UmkmNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-100">
          <header className="mb-8 text-center sm:text-left">
            <Link
              href="/umkm/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 sm:hidden"
            >
              <i className="bi bi-arrow-left"></i>
              Kembali
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              Tambah Produk Baru
            </h1>
            <p className="mt-2 text-slate-600">
              Isi formulir di bawah untuk menambahkan produk ke etalase toko
              Anda.
            </p>
          </header>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill text-lg"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload - Prominent at top */}
            <div className="flex flex-col items-center justify-center">
              <label className="mb-2 block w-full text-sm font-bold text-slate-700 sm:w-auto">
                Foto Produk
              </label>
              <div className="relative group aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  required
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
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 p-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <i className="bi bi-camera-fill text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">
                        Upload Foto
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Format JPG/PNG, Max 2MB
                      </p>
                    </div>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400"
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
                <div className="relative">
                  <select
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
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
              <div className="relative">
                <select
                  required
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                >
                  <option value="ready">Ready Stock</option>
                  <option value="preorder">Pre-Order (PO)</option>
                </select>
                <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-8">
              <Link
                href="/umkm/dashboard"
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Produk"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
