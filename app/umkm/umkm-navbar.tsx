"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UmkmNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/umkm/dashboard", icon: "bi-grid-fill" },
    { label: "Produk Saya", href: "/umkm/products", icon: "bi-box-seam-fill" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-emerald-500/20 border border-emerald-100/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo Desa Mekar Sawit"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Desa Mekar Sawit
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
              Panel UMKM
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/umkm/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <i
                  className={`bi ${item.icon} ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                ></i>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/api/umkm/logout"
            className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 hover:border-red-200"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="hidden sm:inline">Keluar</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden px-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/umkm/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-white border border-slate-100 text-slate-600"
              }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
