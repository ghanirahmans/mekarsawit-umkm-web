"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, startTransition } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    startTransition(() => setIsOpen(false));
  }, [pathname]);

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: "bi-grid-fill" },
    { label: "Verifikasi UMKM", href: "/admin/pending", icon: "bi-shop" },
    {
      label: "Verifikasi Produk",
      href: "/admin/products",
      icon: "bi-bag-check-fill",
    },
    { label: "Kelola User", href: "/admin/users", icon: "bi-people-fill" },
    { label: "Kode Desa", href: "/admin/codes", icon: "bi-upc-scan" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo & Brand */}
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
            <h1 className="text-sm font-bold tracking-tight text-slate-900 hidden sm:block">
              Desa Mekar Sawit
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold hidden sm:block">
              Admin Panel
            </p>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:hidden">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <Link
            prefetch={false}
            href="/api/admin/logout"
            className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 hover:border-red-200"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
        >
          <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"} text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <i
                    className={`bi ${item.icon} text-lg ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                  ></i>
                  {item.label}
                </Link>
              );
            })}
            <Link
              prefetch={false}
              href="/api/admin/logout"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <i className="bi bi-box-arrow-right text-lg"></i>
              Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
