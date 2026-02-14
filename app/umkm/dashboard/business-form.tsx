"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    category: "",
    address: "",
    whatsapp: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
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
      formData.append("businessName", form.businessName);
      formData.append("category", form.category);
      formData.append("address", form.address);
      formData.append("whatsapp", form.whatsapp);
      formData.append("description", form.description);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const res = await fetch("/api/umkm/submit-business", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan profil usaha.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full font-sans text-slate-900">
      <div className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-100">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
            <span className="text-2xl font-bold">1</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Langkah 1: Profil Usaha
          </h1>
          <p className="text-slate-500">
            Isi data usaha sebelum menambahkan produk.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 text-center">
            <i className="bi bi-exclamation-circle-fill mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center justify-center">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Logo / Foto Tempat Usaha (Opsional)
            </label>
            <div className="relative group h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer">
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
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <i className="bi bi-camera-fill text-2xl group-hover:text-emerald-500 transition-colors"></i>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Nama Usaha
            </label>
            <input
              required
              value={form.businessName}
              onChange={(v) =>
                setForm({ ...form, businessName: v.target.value })
              }
              placeholder="Contoh: Keripik Pisang Bu Ani"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Kategori Usaha
              </label>
              <input
                required
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v.target.value })}
                placeholder="Makanan / Kerajinan"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                WhatsApp Bisnis
              </label>
              <input
                required
                value={form.whatsapp}
                onChange={(v) => setForm({ ...form, whatsapp: v.target.value })}
                placeholder="0812xxxx"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Alamat Lengkap
            </label>
            <input
              required
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v.target.value })}
              placeholder="Jalan Mawar No. 12, Dusun II"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Deskripsi Usaha
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(v) =>
                setForm({ ...form, description: v.target.value })
              }
              placeholder="Ceritakan sedikit tentang usaha Anda..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Menyimpan..." : "Simpan Profil Usaha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
