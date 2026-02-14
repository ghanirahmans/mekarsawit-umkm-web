"use client";

import { useEffect, useState, Suspense } from "react";
import AdminNavbar from "@/app/admin/admin-navbar";
import Modal from "@/app/components/modal";
import SearchInput from "@/app/components/search-input";
import { useRouter, useSearchParams } from "next/navigation";

interface VillageCode {
  id: string;
  code: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

function VillageCodesContent() {
  const [codes, setCodes] = useState<VillageCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  useEffect(() => {
    fetchCodes();
  }, [query]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/village-codes?q=${query}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCodes(data);
      }
    } catch (error) {
      console.error("Failed to fetch codes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/village-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      });

      if (res.status === 401) {
        alert("Sesi admin telah habis. Silakan login ulang.");
        router.push("/admin/login");
        return;
      }

      if (res.ok) {
        setNewCode("");
        setModalOpen(false);
        fetchCodes();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat kode");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin ${currentStatus ? "nonaktifkan" : "aktifkan"} kode ini?`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/village-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kode ini secara permanen?")) return;

    try {
      const res = await fetch(`/api/admin/village-codes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Kelola Kode Akses Desa
            </h1>
            <p className="text-slate-500">
              Generate kode unik untuk pendaftaran UMKM baru.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
          >
            <i className="bi bi-plus-lg text-lg"></i>
            Buat Kode Baru
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchInput placeholder="Cari kode..." />
          <button
            onClick={fetchCodes}
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 hover:text-emerald-600 transition-colors"
          >
            <i className="bi bi-arrow-clockwise text-xl"></i>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : codes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mb-4 text-4xl text-slate-300">
              <i className="bi bi-upc-scan"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Belum ada kode akses
            </h3>
            <p className="text-slate-500">
              Silakan buat kode baru untuk memulai pendaftaran UMKM.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Kode Akses</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Dibuat Oleh</th>
                    <th className="px-6 py-4 font-bold">Tanggal Dibuat</th>
                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {codes.map((code) => (
                    <tr key={code.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-base">
                        {code.code}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            code.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              code.isActive ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          ></span>
                          {code.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {code.createdBy || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(code.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleStatus(code.id, code.isActive)}
                            className={`rounded-lg p-2 transition-colors ${
                              code.isActive
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={code.isActive ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <i
                              className={`bi ${code.isActive ? "bi-slash-circle" : "bi-check-circle"} text-lg`}
                            ></i>
                          </button>
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Permanen"
                          >
                            <i className="bi bi-trash text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Buat Kode Akses Baru"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Kode Unik
            </label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) =>
                setNewCode(e.target.value.toUpperCase().replace(/\s/g, ""))
              }
              placeholder="Contoh: MSAWIT2024"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-900 outline-none ring-emerald-500/30 transition-shadow focus:border-emerald-500 focus:bg-white focus:ring-4 placeholder:text-slate-400 font-mono"
            />
            <p className="mt-1 text-xs text-slate-500">
              Gunakan huruf kapital dan angka. Tanpa spasi.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newCode}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Kode"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function VillageCodesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      }
    >
      <VillageCodesContent />
    </Suspense>
  );
}
