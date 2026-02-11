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
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7f2] via-white to-[#fefbf5] text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pt-10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin Desa</p>
          <h1 className="text-3xl font-bold text-slate-900">Verifikasi UMKM</h1>
          <p className="text-slate-600">
            {pending.length} menunggu verifikasi.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
          >
            ← Beranda
          </Link>
          <Link
            href="/api/admin/logout"
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
          >
            Logout
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-14">
        {pending.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Belum ada pendaftar.
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
      </div>
    </div>
  );
}
