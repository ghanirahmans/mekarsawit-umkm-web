"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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
          <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
          <p className="text-slate-500">Panel khusus petugas desa.</p>
        </div>

        {status === "error" && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <i className="bi bi-exclamation-circle-fill text-lg"></i>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Field
            label="Email Admin"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@desa.id"
            required
            icon="bi-envelope"
          />

          <Field
            label="Password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Masukkan password"
            required
            icon="bi-lock"
            rightIcon={
              <i
                className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"} text-slate-400`}
              />
            }
            onRightClick={() => setShowPwd(!showPwd)}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {status === "loading" ? "Memproses..." : "Masuk Panel Admin"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/" className="font-bold text-emerald-700 hover:underline">
            ← Kembali ke Beranda
          </Link>
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
  type = "text",
  required,
  icon,
  rightIcon,
  onRightClick,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: string;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <i className={`bi ${icon} absolute left-4 top-3 text-slate-400`}></i>
        )}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-emerald-500/30 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 ${
            icon ? "pl-11" : ""
          } ${rightIcon ? "pr-11" : ""}`}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightClick}
            className="absolute right-4 top-3 hover:text-slate-600"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}
