import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hubungi Kami",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Hubungi Kami</h1>
        <p className="text-slate-600 mb-8">
          Punya pertanyaan seputar Desa Mekar Sawit atau ingin bergabung sebagai
          UMKM? Silakan hubungi admin kami melalui WhatsApp.
        </p>

        <Link
          href="https://wa.me/6285186836565"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
        >
          <i className="bi bi-whatsapp"></i>
          Chat WhatsApp Admin
        </Link>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-slate-500 hover:text-emerald-700"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
