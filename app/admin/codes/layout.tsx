import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Kode Akses",
};

export default function CodesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
