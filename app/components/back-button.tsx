"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  className?: string;
  label?: string; // Optional custom label
}

export default function BackButton({
  href = "/",
  className = "",
  label,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 ${className}`}
    >
      <i className="bi bi-arrow-left-short text-xl"></i>
      {label ? (
        <span>{label}</span>
      ) : (
        <>
          <span className="sm:hidden">Kembali</span>
          <span className="hidden sm:inline">Kembali ke Beranda</span>
        </>
      )}
    </Link>
  );
}
