"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/app/components/modal";

type ProductItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  active: boolean;
};

export default function ProductList({ products }: { products: ProductItem[] }) {
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
      "Hapus Produk",
      <div className="space-y-4">
        <p>Apakah Anda yakin ingin menghapus produk ini?</p>
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
    // Show loading state in modal if needed, or just close and show success/error
    // For simplicity, let's just try to delete.
    setModalOpen(false); // Close confirmation modal first

    try {
      const res = await fetch(`/api/umkm/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      router.refresh();
      // Optional: Show success modal
    } catch {
      showModal("Gagal", <p>Gagal menghapus produk.</p>);
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <div className="mb-4 text-4xl text-slate-300">
          <i className="bi bi-box-seam"></i>
        </div>
        <p className="text-slate-500 font-medium">Belum ada produk.</p>
        <p className="text-sm text-slate-400 mt-1">
          Mulai tambahkan produk untuk ditampilkan di katalog.
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 group hover:border-emerald-200 transition"
          >
            <div className="aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden relative">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${product.active ? "bg-white/90 text-emerald-700" : "bg-slate-800/90 text-white"}`}
                >
                  {product.active ? "Aktif" : "Non-Aktif"}
                </span>
              </div>
            </div>
            <h4 className="font-bold text-slate-900 line-clamp-1">
              {product.name}
            </h4>
            <p className="text-sm font-semibold text-emerald-600">
              Rp{product.price.toLocaleString("id-ID")}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/umkm/products/edit/${product.id}`}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 rounded-lg border border-red-100 py-2 text-center text-xs font-bold text-red-600 hover:bg-red-50 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
