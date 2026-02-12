"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UmkmLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/umkm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal.");

      router.push("/umkm/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-emerald-500/10 border border-emerald-100/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo Desa Mekar Sawit"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login UMKM</h1>
          <p className="text-slate-500">Kelola usaha Anda dengan mudah.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <i className="bi bi-exclamation-circle-fill text-lg"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Nomor HP
            </label>
            <div className="relative">
              <i className="bi bi-phone absolute left-4 top-3.5 text-slate-400"></i>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Contoh: 0812xxxx"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-11 py-3 text-sm font-medium text-slate-900 outline-none ring-emerald-500/30 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Password
            </label>
            <div className="relative">
              <i className="bi bi-lock absolute left-4 top-3.5 text-slate-400"></i>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Masukkan password Anda"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-11 py-3 text-sm font-medium text-slate-900 outline-none ring-emerald-500/30 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500">Belum punya akun?</p>
          <Link
            href="/daftar-umkm"
            className="font-bold text-emerald-600 hover:underline"
          >
            Daftar UMKM Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
