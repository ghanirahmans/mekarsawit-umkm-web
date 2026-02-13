"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/app/components/modal";

export default function UserList({ users }: { users: any[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const showModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    showModal(
      "Hapus User",
      <div className="space-y-4">
        <p>
          Yakin ingin menghapus user ini? Data usaha dan produk juga akan
          terhapus permanen.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Batal
          </button>
          <button
            onClick={() => confirmDelete(id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>,
    );
  };

  const confirmDelete = async (id: string) => {
    setModalOpen(false);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        showModal("Gagal", <p>Gagal menghapus user.</p>);
      }
    } catch (e) {
      console.error(e);
      showModal("Error", <p>Terjadi kesalahan.</p>);
    }
  };

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
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>

      {/* Mobile Card View (< md) */}
      <div className="grid gap-4 md:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-900">{u.phone || "-"}</div>
                <div className="text-xs text-slate-500 font-mono">
                  ID: {u.id.substring(0, 8)}...
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                UMKM
              </span>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Usaha Terkait:
              </p>
              {u.businesses.length > 0 ? (
                u.businesses.map((b: any) => (
                  <div key={b.id} className="mb-2 last:mb-0">
                    <div className="font-semibold text-slate-900 text-sm">
                      {b.name}
                    </div>
                    <div className="text-xs text-slate-500">{b.category}</div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Belum ada usaha
                </span>
              )}
            </div>

            {u.role !== "super_admin" && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                >
                  Hapus User
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
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
                  <div className="font-bold text-slate-900">
                    {u.phone || "-"}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    ID: {u.id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    UMKM Owner
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.businesses.length > 0 ? (
                    u.businesses.map((b: any) => (
                      <div key={b.id}>
                        <div className="font-semibold text-slate-900">
                          {b.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {b.category}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">
                      Belum ada usaha
                    </span>
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
    </>
  );
}
