"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(data?.error ?? "Login gagal");
      return;
    }
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-white to-[#fff7ec] text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div
            className="absolute -left-14 -top-14 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl"
            aria-hidden
          />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg shadow-emerald-500/10 border border-emerald-100/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Logo Desa Mekar Sawit"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm font-semibold text-emerald-700">
                Admin Desa
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                Masuk Panel Admin
              </h1>
              <p className="text-slate-600">
                Gunakan email admin, password, dan kode desa aktif.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
            >
              ← Beranda
            </Link>
          </div>

          <form onSubmit={onSubmit} className="relative mt-6 space-y-4">
            <Field
              label="Email admin"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@mekarsawit.local"
              required
            />
            <Field
              label="Password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              rightIcon={
                <i
                  className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"} text-slate-600 text-lg`}
                />
              }
              onRightClick={() => setShowPwd((s) => !s)}
            />
            <Field
              label="Kode desa"
              value={code}
              onChange={setCode}
              placeholder="MSAWITDEV"
              required
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:opacity-70"
              >
                {status === "loading" ? "Memproses..." : "Masuk"}
              </button>
              <a
                href="https://wa.me/6281111111111?text=Halo%20Admin%2C%20saya%20butuh%20akses%20panel%20desa."
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Minta bantuan
              </a>
            </div>

            {status === "error" && (
              <p className="text-sm font-semibold text-red-600">❌ {message}</p>
            )}
          </form>
        </div>

        <aside className="rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-emerald-800">
            Tips keamanan
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-900">
            <li>• Jangan bagikan password admin.</li>
            <li>• Ganti kode desa setiap bulan.</li>
            <li>• Logout setelah verifikasi.</li>
          </ul>
          <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Dev: email{" "}
            <code className="bg-white px-1">admin@mekarsawit.local</code> · pass{" "}
            <code className="bg-white px-1">admin123</code> · kode{" "}
            <code className="bg-white px-1">MSAWITDEV</code>
          </div>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-800 shadow-inner">
            UMKM login tetap via halaman &quot;Daftar UMKM&quot; (OTP/HP nanti).
            Panel ini khusus super admin desa.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  rightIcon,
  onRightClick,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      <div className="mb-1 flex items-center justify-between">
        <span>{label}</span>
      </div>
      <div className="relative">
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-100 focus:ring-2 pr-10"
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightClick}
            className="absolute inset-y-0 right-2 flex items-center text-lg"
            aria-label="Toggle password visibility"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </label>
  );
}
