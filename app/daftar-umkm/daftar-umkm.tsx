"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const steps = [
  { title: "Ambil kode desa", desc: "Datang ke kantor desa/BUMDes, dapatkan kode akses aktif (rotasi bulanan)." },
  { title: "Isi formulir", desc: "Lengkapi data usaha & nomor HP, kirim permohonan." },
  { title: "Menunggu verifikasi", desc: "Admin desa cek & approve. Setelah itu produk bisa ditambah." },
];

type State = "idle" | "loading" | "success" | "error";

export default function DaftarUmkmScreen() {
  const [status, setStatus] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [form, setForm] = useState({
    villageCode: "",
    phone: "",
    businessName: "",
    category: "",
    address: "",
    whatsapp: "",
    description: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/register-umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal daftar");
      setStatus("success");
      setMessage("Berhasil mendaftar. Admin desa akan memverifikasi.");
      setForm({ villageCode: "", phone: "", businessName: "", category: "", address: "", whatsapp: "", description: "" });
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7f2] via-white to-[#fefbf5] text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pt-10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Pendaftaran UMKM</p>
          <h1 className="text-3xl font-bold text-slate-900">Gabung katalog desa Mekar Sawit</h1>
          <p className="text-slate-600">Katalog publik, pesanan tetap via WhatsApp langsung ke pemilik usaha.</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
        >
          ← Beranda
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Form daftar UMKM</h2>
              <p className="text-sm text-slate-600">Verifikasi nomor nanti; sekarang cukup kirim data dasar.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Kode desa" required value={form.villageCode} onChange={(v) => setForm({ ...form, villageCode: v })} placeholder="MSAWITDEV" />
              <Field label="Nomor HP (pemilik)" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="62812xxxx" />
              <Field label="Nama usaha" required value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="Gula Semut Pak Budi" />
              <Field label="Kategori" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Makanan / Pertanian / Kerajinan" />
              <Field label="Alamat / titik pickup" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="RT/RW, patokan" />
              <Field label="Nomor WhatsApp untuk pesanan" required value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="62812xxxx" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Deskripsi singkat
                <textarea
                  className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-100 focus:ring-2"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Produk utama, keunggulan, jadwal stok."
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:opacity-70"
            >
              {status === "loading" ? "Mengirim..." : "Kirim pendaftaran"}
            </button>
            {status === "success" && <p className="text-sm font-semibold text-emerald-700">✅ {message || "Berhasil mendaftar."}</p>}
            {status === "error" && <p className="text-sm font-semibold text-red-600">❌ {message}</p>}
          </form>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Prasyarat singkat</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Domisili UMKM di Desa Mekar Sawit.</li>
                <li>• Nomor WA aktif khusus pesanan.</li>
                <li>• Foto produk jelas (max 1–2 MB, disarankan WebP).</li>
                <li>• Bersedia verifikasi alamat/pickup oleh admin desa.</li>
              </ul>
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Kode dev: <code className="rounded bg-white px-2 py-1">MSAWITDEV</code> · Prod: kode rotasi bulanan (hubungi admin desa).
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <h2 className="text-lg font-semibold text-amber-900">Kontak admin</h2>
              <p className="mt-2 text-amber-900/80">Chat admin desa untuk minta kode aktif atau bantuan teknis.</p>
              <a
                href="https://wa.me/6281111111111?text=Halo%20admin%2C%20saya%20mau%20daftar%20UMKM%20Mekar%20Sawit."
                className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                Chat Admin via WhatsApp
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Alur singkat</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {steps.map((step, idx) => (
                  <div key={step.title} className="rounded-2xl border border-emerald-50 bg-emerald-50/40 p-4">
                    <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-slate-800">
      {label}
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-100 focus:ring-2"
      />
    </label>
  );
}
