import PublicNavbar from "@/app/components/public-navbar";
import React from "react";

const info = [
  {
    label: "Wilayah",
    value: "Desa Mekar Sawit, Kec. Sawit Seberang, Kab. Langkat",
    icon: "bi-geo-alt-fill",
  },
  {
    label: "Koordinat",
    value: "3.6864° N, 98.3103° E (perkiraan)",
    icon: "bi-compass-fill",
  },
  {
    label: "Penduduk",
    value: "≈ 3.5K jiwa (data desa terakhir)",
    icon: "bi-people-fill",
  },
  {
    label: "UMKM terdata",
    value: "30+ (pangan, pertanian, kerajinan)",
    icon: "bi-shop",
  },
];

const unggulan = [
  "Gula semut aren kampung",
  "Kopi bukit robusta sangrai medium",
  "Keripik pisang & singkong rumahan",
  "Anyaman bambu & rotan",
];

export default function ProfilDesaScreen() {
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Navbar */}
      <PublicNavbar />

      <main className="relative pt-24 pb-20">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl mix-blend-multiply" />
          <div className="absolute right-[-10%] top-40 h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl opacity-60 mix-blend-multiply" />
        </div>

        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 mb-4">
              <i className="bi bi-info-circle-fill"></i>
              Tentang Desa
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Profil Desa Mekar Sawit
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-700 leading-relaxed font-medium">
              Membangun ekonomi desa melalui pemberdayaan UMKM lokal dan inovasi
              digital. Pusat pertumbuhan ekonomi kreatif di Sawit Seberang.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-8">
              {/* Identitas Desa Card */}
              <div className="rounded-3xl border border-white/50 bg-white/60 p-8 shadow-lg shadow-emerald-100/50 backdrop-blur-xl ring-1 ring-slate-100">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
                  <i className="bi bi-card-heading text-emerald-600 text-2xl"></i>
                  Identitas Wilayah
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {info.map((item) => (
                    <div
                      key={item.label}
                      className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visi & Misi Cards */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="group rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-1">
                  <div className="mb-4 h-10 w-10 text-3xl opacity-80">
                    <i className="bi bi-eye-fill"></i>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">Visi Desa</h3>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    Menjadi sentra produk lokal sehat dan berkelanjutan,
                    memperkuat ekonomi keluarga desa melalui digitalisasi.
                  </p>
                </div>

                <div className="group rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
                  <div className="mb-4 h-10 w-10 text-3xl text-amber-500">
                    <i className="bi bi-lightning-charge-fill"></i>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Misi Utama
                  </h3>
                  <ul className="space-y-2 text-sm font-medium text-slate-600">
                    <li className="flex gap-2">
                      <i className="bi bi-check-circle-fill text-emerald-500"></i>{" "}
                      Pemberdayaan UMKM
                    </li>
                    <li className="flex gap-2">
                      <i className="bi bi-check-circle-fill text-emerald-500"></i>{" "}
                      Digitalisasi Layanan
                    </li>
                    <li className="flex gap-2">
                      <i className="bi bi-check-circle-fill text-emerald-500"></i>{" "}
                      Peningkatan Kualitas Produk
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Fokus UMKM Card */}
              <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-900">
                  <i className="bi bi-stars text-amber-600"></i>
                  Produk Unggulan
                </h2>
                <ul className="space-y-3">
                  {unggulan.map((u) => (
                    <li
                      key={u}
                      className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100 transition-transform hover:translate-x-1"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <i className="bi bi-check"></i>
                      </span>
                      {u}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-white/50 p-4 text-xs font-medium text-amber-900/80">
                  <p>
                    <i className="bi bi-chat-quote-fill mr-2 text-amber-500"></i>
                    Fasilitas desa meliputi titik pickup di BUMDes dan promosi
                    mingguan via blast WhatsApp.
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10">
                <h2 className="mb-4 text-lg font-bold">Butuh Informasi?</h2>
                <p className="mb-6 text-sm text-slate-300">
                  Kantor Desa Mekar Sawit buka setiap hari kerja pukul
                  08.00–15.00 WIB.
                </p>
                <a
                  href="https://wa.me/6281111111111?text=Halo%20Admin%20Desa%2C%20saya%20mau%20tanya%20profil%20desa."
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 active:scale-95"
                >
                  <i className="bi bi-whatsapp"></i>
                  Chat Admin Desa
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
