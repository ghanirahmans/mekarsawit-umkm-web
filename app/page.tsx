import { getHeroStats, getLandingCatalog } from "@/lib/services/catalog";
import { buildWaLink } from "@/lib/wa";

const adminWa = buildWaLink({
  phone: "6281111111111",
  notes: "Halo admin desa, saya mau tanya katalog UMKM Mekar Sawit.",
});

export default function Home() {
  const catalog = getLandingCatalog();
  const stats = getHeroStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f4ea] via-white to-[#fefbf3] text-slate-900">
      <header className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-12 pt-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 lg:max-w-xl">
          <p className="w-fit rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-800">
            UMKM Desa Mekar Sawit · Sawit Seberang
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Belanja langsung dari <span className="text-emerald-700">UMKM Mekar Sawit</span>.
          </h1>
          <p className="text-lg text-slate-700">
            Gula semut, kopi bukit, keripik kampung, kerajinan bambu—produk lokal terkurasi. Pilih katalog, pesan via
            WhatsApp, jemput di titik desa atau janjian dengan penjual.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#katalog"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Lihat Katalog
            </a>
            <a
              href={adminWa}
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
            >
              Chat Admin Desa
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatChip label="UMKM Aktif" value={`${stats.activeBusinesses}+`} />
            <StatChip label="Produk Tersedia" value={`${stats.activeProducts}+`} />
            <StatChip label="Kategori" value={`${stats.categories}`} />
          </div>
        </div>
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-amber-400 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-wide text-emerald-100">Cara pesan</p>
            <StepItem title="1. Pilih produk" detail="Pilih dari katalog UMKM Mekar Sawit." />
            <StepItem title="2. Klik WhatsApp" detail="Pesan langsung ke pemilik usaha." />
            <StepItem title="3. Atur kirim/jemput" detail="Janjian lokasi atau titik BUMDes." />
          </div>
          <div className="mt-6 rounded-2xl bg-white/15 p-4 text-sm leading-6">
            <p className="font-semibold">Kode akses pelaku UMKM</p>
            <p>Dev: <code className="rounded bg-white/20 px-2 py-1">MSAWITDEV</code></p>
            <p className="text-emerald-50">Prod: kode rotasi bulanan (super admin).</p>
          </div>
        </div>
      </header>

      <section id="katalog" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Katalog</p>
            <h2 className="text-3xl font-bold text-slate-900">Produk UMKM unggulan</h2>
            <p className="text-slate-600">Klik kartu untuk pesan via WhatsApp.</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-emerald-50">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-emerald-700">Foto menyusul</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {item.stockStatus === "ready" ? "Stok siap" : "Pre-order"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-700">{item.businessCategory}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.businessName}</p>
                </div>
                <p className="text-xl font-bold text-emerald-800">
                  Rp{item.price.toLocaleString("id-ID")} <span className="text-sm font-medium text-slate-500">/ {item.unit}</span>
                </p>
                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                <div className="mt-auto">
                  <a
                    href={item.waLink}
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
                  >
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-amber-100 bg-amber-50 px-6 py-8 shadow-sm sm:px-10">
          <h3 className="text-2xl font-bold text-amber-900">Daftarkan UMKM kamu</h3>
          <p className="mt-2 max-w-2xl text-amber-900/80">
            Pelaku UMKM Mekar Sawit bisa login dengan kode desa (dev: MSAWITDEV, prod: kode rotasi bulanan), verifikasi oleh
            admin desa, lalu tambah katalog sendiri. Pesanan tetap lewat WhatsApp.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">
              Kode desa + OTP nomor HP
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">
              Admin desa approve & verifikasi
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner">
              UMKM kelola produk & foto
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-left shadow-sm">
      <p className="text-xs uppercase tracking-wide text-emerald-700">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StepItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 text-white">
      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-sm font-bold text-white">
        •
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-emerald-50">{detail}</p>
      </div>
    </div>
  );
}
