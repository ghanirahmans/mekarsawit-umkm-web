import AdminNavbar from "../admin-navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildWaLink } from "@/lib/wa";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session } });
  if (user?.role !== "super_admin") return null;
  return user;
}

export default async function PendingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const pending = await prisma.business.findMany({
    where: { verified: false },
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Admin Desa</p>
            <h2 className="text-3xl font-bold text-slate-900">
              Verifikasi UMKM
            </h2>
            <p className="mt-2 text-slate-600">
              Daftar UMKM baru yang menunggu persetujuan untuk mulai berjualan (
              {pending.length} menunggu verifikasi).
            </p>
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
              <i className="bi bi-check-circle"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Semua Beres!</h3>
            <p className="text-slate-500">
              Tidak ada pendaftar baru yang menunggu verifikasi.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pending.map((biz) => (
              <div
                key={biz.id}
                className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-700">
                      {biz.category}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Owner: {biz.owner.phone}
                    </p>
                    <p className="text-sm text-slate-600">WA: {biz.whatsapp}</p>
                    <p className="text-sm text-slate-600">
                      Alamat: {biz.address}
                    </p>
                    {biz.description && (
                      <p className="mt-1 text-sm text-slate-700">
                        {biz.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <a
                      href={buildWaLink({
                        phone: biz.whatsapp,
                        businessName: biz.name,
                        notes: "Halo, kami sedang verifikasi UMKM.",
                      })}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      Chat pemilik
                    </a>
                    <form
                      action={`/api/admin/approve`}
                      method="post"
                      className="flex gap-2"
                    >
                      <input type="hidden" name="id" value={biz.id} />
                      <button
                        className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
                        type="submit"
                      >
                        Approve
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
