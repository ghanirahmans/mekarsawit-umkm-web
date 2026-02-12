"use client";

import { useRouter } from "next/navigation";

export default function UserList({ users }: { users: any[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Yakin ingin menghapus user ini? Data usaha dan produk juga akan terhapus permanen.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus user.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan.");
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
          <i className="bi bi-people"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Belum Ada User</h3>
        <p className="text-slate-500">
          Belum ada pengguna yang terdaftar di sistem.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-6 py-4 font-bold">User Info</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4 font-bold">Usaha Terkait</th>
            <th className="px-6 py-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{u.phone || "-"}</div>
                <div className="text-xs text-slate-500">
                  ID: {u.id.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${u.role === "super_admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {u.role === "super_admin" ? "Super Admin" : "UMKM Owner"}
                </span>
              </td>
              <td className="px-6 py-4">
                {u.businesses.length > 0 ? (
                  u.businesses.map((b: any) => (
                    <div key={b.id}>
                      <div className="font-semibold text-slate-900">
                        {b.name}
                      </div>
                      <div className="text-xs text-slate-500">{b.category}</div>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Belum ada usaha</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {u.role !== "super_admin" && (
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    Hapus
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
