"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Ambil kode desa",
    desc: "Dapatkan kode akses dari kantor desa/BUMDes.",
    icon: "bi-upc-scan",
  },
  {
    title: "Buat Akun",
    desc: "Daftar menggunakan Nomor HP dan set Password.",
    icon: "bi-person-plus",
  },
  {
    title: "Mulai Usaha",
    desc: "Login dan daftarkan usaha Anda di dashboard.",
    icon: "bi-shop",
  },
];

type State = "idle" | "loading" | "success" | "error";

export default function DaftarUmkmScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [form, setForm] = useState({
    villageCode: "",
    name: "",
    phone: "",
    password: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/umkm/register-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal daftar");

      setStatus("success");
      setMessage("Akun berhasil dibuat! Mengalihkan ke halaman login...");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/umkm/login");
      }, 2000);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setMessage(msg);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/50 bg-white/90 backdrop-blur-md transition-all shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Logo Desa Mekar Sawit"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Desa Mekar Sawit
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                  Langkat, Sumatera Utara
                </p>
              </div>
            </Link>
          </div>
          <Link
            href="/"
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 active:scale-95"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Buat Akun UMKM
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Mulai langkah digitalisasi usaha Anda dengan membuat akun.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white bg-white p-8 shadow-sm"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Data Akun</h2>
                <p className="text-sm text-slate-500">
                  Isi data diri Anda untuk membuat akun.
                </p>
              </div>

              {status === "success" && (
                <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200">
                  <div className="flex items-center gap-3">
                    <i className="bi bi-check-circle-fill text-xl"></i>
                    <p className="font-semibold">{message}</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
                  <div className="flex items-center gap-3">
                    <i className="bi bi-exclamation-triangle-fill text-xl"></i>
                    <p className="font-semibold">{message}</p>
                  </div>
                </div>
              )}

              <div className="grid gap-5">
                <div>
                  <Field
                    label="Kode Desa"
                    required
                    value={form.villageCode}
                    onChange={(v) => setForm({ ...form, villageCode: v })}
                    placeholder="Contoh: MSAWITDEV"
                    icon="bi-key"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Dapatkan kode di kantor desa/BUMDes.
                  </p>
                </div>

                <Field
                  label="Nama Lengkap"
                  required
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Nama sesuai KTP"
                  icon="bi-person"
                />

                <Field
                  label="Nomor HP Pemilik"
                  required
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  placeholder="0812xxxx"
                  icon="bi-phone"
                />

                <div>
                  <Field
                    label="Password Login"
                    required
                    type="password"
                    value={form.password}
                    onChange={(v) => setForm({ ...form, password: v })}
                    placeholder="Buat password aman"
                    icon="bi-lock"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Password ini digunakan untuk login ke dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                >
                  {status === "loading" ? (
                    <>
                      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Buat Akun
                      <i className="bi bi-arrow-right-short text-xl transition-transform group-hover:translate-x-1"></i>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">Sudah punya akun?</p>
                <Link
                  href="/umkm/login"
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Login di sini
                </Link>
              </div>
            </form>

            <div className="space-y-6">
              {/* Alur Steps */}
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-emerald-50">
                <h2 className="mb-6 text-lg font-bold text-slate-900">
                  Langkah Mudah
                </h2>
                <div className="relative space-y-8 pl-4 before:absolute before:left-[27px] before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-slate-100">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-emerald-700 ring-4 ring-white shadow-sm border border-emerald-100">
                        <i className={`bi ${step.icon} text-lg`}></i>
                      </div>
                      <div className="pt-2">
                        <h3 className="font-bold text-slate-900 leading-none">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-amber-50 p-6 border border-amber-100">
                <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <i className="bi bi-info-circle-fill text-amber-500"></i>
                  Info Penting
                </h2>
                <div className="mt-4 space-y-3 text-sm font-medium text-amber-900/80">
                  <p>• Data usaha akan diisi setelah Anda berhasil login.</p>
                  <div className="mt-4 rounded-xl bg-white/60 p-3 text-xs">
                    <span className="font-bold">Kode Dev:</span>{" "}
                    <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-amber-200">
                      MSAWITDEV
                    </code>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/6281111111111?text=Halo%20admin%2C%20saya%20mau%20daftar%20UMKM%20Mekar%20Sawit."
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-100 bg-white py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 hover:border-emerald-200"
              >
                <i className="bi bi-whatsapp"></i>
                Bantuan Admin
              </a>
            </div>
          </div>
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {icon && <i className={`bi ${icon} mr-2 opacity-50`}></i>}
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/30 transition-shadow focus:border-emerald-500 focus:bg-white focus:ring-4 placeholder:text-slate-400 font-medium"
      />
    </label>
  );
}
