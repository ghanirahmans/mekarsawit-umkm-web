import type { Metadata } from "next";
import { redirect } from "next/navigation";
import UmkmNavbar from "../umkm-navbar";
import { getSessionUmkm } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profil UMKM",
};

export const dynamic = "force-dynamic";

export default async function UmkmProfilePage() {
  const user = await getSessionUmkm();
  if (!user) redirect("/umkm/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: user.id },
    select: {
      name: true,
      category: true,
      address: true,
      whatsapp: true,
      verified: true,
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UmkmNavbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Profil Akun UMKM</h1>
          <p className="mt-1 text-slate-600">
            Informasi akun dan status usaha Anda.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info label="Nama Pemilik" value={user.name || "-"} />
            <Info label="Nomor HP" value={user.phone || "-"} />
            <Info label="Kode Desa" value={user.villageCode || "-"} />
            <Info
              label="Tanggal Daftar"
              value={new Date(user.createdAt).toLocaleDateString("id-ID")}
            />
            <Info label="Nama Usaha" value={business?.name || "-"} />
            <Info label="Kategori" value={business?.category || "-"} />
            <Info label="Alamat" value={business?.address || "-"} />
            <Info label="WhatsApp Usaha" value={business?.whatsapp || "-"} />
            <Info
              label="Status Verifikasi"
              value={business ? (business.verified ? "Terverifikasi" : "Menunggu Verifikasi") : "Belum membuat usaha"}
            />
          </dl>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <form action="/api/umkm/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
              >
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
