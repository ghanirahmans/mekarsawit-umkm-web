"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "Kuliner (Makanan/Minuman)",
  "Fashion & Pakaian",
  "Kerajinan Tangan",
  "Jasa / Layanan",
  "Pertanian & Perkebunan",
  "Peternakan",
  "Perikanan",
  "Toko Kelontong / Grosir",
  "Elektronik & Pulsa",
  "Properti / Kos",
  "Otomotif / Bengkel",
  "Kesehatan & Kecantikan",
];

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentCategory = searchParams.get("category") || "";

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative min-w-[200px]">
      <select
        value={currentCategory}
        onChange={(e) => handleFilter(e.target.value)}
        className="block w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none ring-emerald-500/30 transition-all focus:border-emerald-500 focus:ring-4 hover:border-emerald-300 cursor-pointer"
      >
        <option value="">Semua Kategori</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <i className="bi bi-funnel-fill absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
    </div>
  );
}
