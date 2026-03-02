import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login UMKM",
};

export default function UmkmLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
