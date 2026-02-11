import Link from "next/link";

const info = [
  { label: "Wilayah", value: "Desa Mekar Sawit, Kec. Sawit Seberang, Kab. Langkat" },
  { label: "Koordinat", value: "3.6864° N, 98.3103° E (perkiraan)" },
  { label: "Penduduk", value: "≈ 3.5K jiwa (data desa terakhir)" },
  { label: "UMKM terdata", value: "30+ (pangan, pertanian, kerajinan)" },
];

const unggulan = [
  "Gula semut aren kampung",
  "Kopi bukit robusta sangrai medium",
  "Keripik pisang & singkong rumahan",
  "Anyaman bambu & rotan",
];

export default function ProfilDesaScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7f2] via-white to-[#fefbf5] text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pt-10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Profil Desa</p>
          <h1 className="text-3xl font-bold text-slate-900">Desa Mekar Sawit</h1>
          <p className="text-slate-600">Gambaran singkat desa dan ekosistem UMKM yang dibina.</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
        >
          ← Beranda
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Identitas desa</h2>
            <dl className="mt-3 space-y-2 text-sm text-slate-700">
              {info.map((item) => (
                <div key={item.label} className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-900">{item.label}</dt>
                  <dd className="text-right text-slate-700">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-sky-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Fokus UMKM</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {unggulan.map((u) => (
                <li key={u} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-700">
              Desa menyiapkan titik pickup di BUMDes dan memfasilitasi broadcast promo mingguan untuk UMKM terverifikasi.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">Visi singkat</p>
            <p className="mt-2 text-sm text-slate-700">Menjadi sentra produk lokal sehat dan berkelanjutan, memperkuat ekonomi keluarga desa.</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">Dukungan</p>
            <p className="mt-2 text-sm text-slate-700">Pendampingan harga, foto produk, dan rotasi kode akses untuk menjaga keanggotaan UMKM desa.</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">Kontak desa</p>
            <p className="mt-2 text-sm text-slate-700">Kantor Desa Mekar Sawit, Jam kerja 08.00–15.00 WIB.</p>
            <a
              href="https://wa.me/6281111111111?text=Halo%20Admin%20Desa%2C%20saya%20mau%20tanya%20profil%20desa."
              className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Chat Admin Desa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
