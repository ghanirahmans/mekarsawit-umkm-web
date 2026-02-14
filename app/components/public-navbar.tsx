"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUmkmLoggedIn, setIsUmkmLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    startTransition(() => {
      setIsUmkmLoggedIn(document.cookie.includes("umkm_logged_in=1"));
    });
  }, []);

  return (
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

        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="/katalog" current={pathname}>
            Katalog
          </NavLink>
          <NavLink href="/profil-desa" current={pathname}>
            Profil Desa
          </NavLink>
          <NavLink href="/daftar-umkm" current={pathname}>
            Gabung UMKM
          </NavLink>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isUmkmLoggedIn ? (
            <>
              <Link
                href="/umkm/dashboard"
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              >
                Dashboard
              </Link>
              <Link
                href="/umkm/profile"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 hover:shadow-emerald-500/30"
              >
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/umkm/login"
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              >
                Masuk
              </Link>
              <Link
                href="/daftar-umkm"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 hover:shadow-emerald-500/30"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <i
            className={`bi ${isMenuOpen ? "bi-x-lg" : "bi-list"} text-2xl`}
          ></i>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <MobileNavLink href="/katalog" onClick={() => setIsMenuOpen(false)}>
              <i className="bi bi-shop mr-2 text-emerald-600"></i>
              Katalog Produk
            </MobileNavLink>
            <MobileNavLink
              href="/profil-desa"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-info-circle mr-2 text-emerald-600"></i>
              Profil Desa
            </MobileNavLink>
            <MobileNavLink
              href="/daftar-umkm"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-briefcase mr-2 text-emerald-600"></i>
              Gabung UMKM
            </MobileNavLink>
            <hr className="border-slate-100" />
            <div className="grid grid-cols-2 gap-3">
              {isUmkmLoggedIn ? (
                <>
                  <Link
                    href="/umkm/dashboard"
                    className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/umkm/profile"
                    className="flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                  >
                    Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/umkm/login"
                    className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar-umkm"
                    className="flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  current,
}: {
  href: string;
  children: React.ReactNode;
  current: string;
}) {
  const isActive = current === href;
  return (
    <Link
      href={href}
      className={`text-sm font-semibold transition-colors ${
        isActive ? "text-emerald-700" : "text-slate-700 hover:text-emerald-700"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center rounded-xl p-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}
