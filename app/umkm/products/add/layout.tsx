import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default function AddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
