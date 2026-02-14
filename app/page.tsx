import HomeScreen from "./beranda";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Temukan produk unggulan UMKM Desa Mekar Sawit. Belanja produk lokal berkualitas, dukung ekonomi desa.",
  openGraph: {
    title: "Desa Mekar Sawit - Pusat UMKM Digital",
    description:
      "Etalase digital produk UMKM Desa Mekar Sawit. Dari pangan hingga kerajinan, siap kirim.",
    url: "https://mekarsawit.desa.id",
    siteName: "Desa Mekar Sawit",
    locale: "id_ID",
    type: "website",
  },
};

export default function Page() {
  return <HomeScreen />;
}
