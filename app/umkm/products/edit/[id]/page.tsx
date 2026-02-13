"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UmkmNavbar from "../../../umkm-navbar";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    stockStatus: "ready",
    description: "",
    imageUrl: "",
    active: true,
  });

  useEffect(() => {
    fetch(`/api/umkm/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm({
          name: data.name,
          price: data.price.toString(),
          unit: data.unit,
          stockStatus: data.stockStatus,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          active: data.active,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/umkm/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/umkm/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

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
            <h1 className="text-2xl font-bold text-slate-900">Edit Produk</h1>
            <p className="mt-2 text-slate-600">
              Perbarui informasi produk Anda di sini.
            </p>
          </header>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill text-lg"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Nama Produk
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
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
                <input
                  required
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Status Stok
              </label>
              <div className="relative">
                <select
                  value={form.stockStatus}
                  onChange={(e) =>
                    setForm({ ...form, stockStatus: e.target.value })
                  }
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
                Status Aktif
              </label>
              <div className="relative">
                <select
                  value={form.active ? "true" : "false"}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.value === "true" })
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                >
                  <option value="true">Aktif (Tampil di Katalog)</option>
                  <option value="false">Sembunyikan</option>
                </select>
                <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400 resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                Link Gambar
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder:text-slate-400"
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
                disabled={saving}
                className="flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
