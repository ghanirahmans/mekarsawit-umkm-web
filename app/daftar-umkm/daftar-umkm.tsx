"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/app/components/public-navbar";
import Modal from "@/app/components/modal";

const steps = [
  {
    title: "Buat Akun",
    desc: "Isi data diri untuk akses dashboard.",
    icon: "bi-person-plus",
    step: 1,
  },
  {
    title: "Data Usaha",
    desc: "Lengkapi profil usaha UMKM Anda.",
    icon: "bi-shop",
    step: 2,
  },
  {
    title: "Selesai",
    desc: "Tunggu verifikasi dan mulai berjualan.",
    icon: "bi-check-circle",
    step: 3,
  },
];

type State = "idle" | "loading" | "success" | "error";

export default function DaftarUmkmScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  // Form State
  const [form, setForm] = useState({
    villageCode: "",
    name: "",
    phone: "",
    password: "",
    businessName: "",
    category: "",
    address: "",
    whatsapp: "",
    description: "",
  });

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showModal("Gagal Upload", "Ukuran gambar maksimal 2MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onNext = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.villageCode || !form.name || !form.phone || !form.password) {
        showModal("Data Belum Lengkap", "Mohon lengkapi semua data akun.");
        return;
      }
      setStep(2);
    } else {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    setStatus("loading");
    setMessage("");

    if (
      !form.businessName ||
      !form.category ||
      !form.address ||
      !form.whatsapp
    ) {
      setStatus("idle");
      showModal("Data Belum Lengkap", "Mohon lengkapi data usaha wajib.");
      return;
    }

    try {
      const formData = new FormData();
      // Account
      formData.append("villageCode", form.villageCode);
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("password", form.password);

      // Business
      formData.append("businessName", form.businessName);
      formData.append("category", form.category);
      formData.append("address", form.address);
      formData.append("whatsapp", form.whatsapp);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const res = await fetch("/api/umkm/register-account", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal daftar");

      setStatus("success");
      setMessage("Pendaftaran Berhasil! Masuk ke dashboard...");

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/umkm/dashboard";
      }, 2000);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setMessage(msg);
      showModal("Pendaftaran Gagal", msg);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <p>{modalMessage}</p>
      </Modal>

      {/* Navbar */}
      <PublicNavbar />

      <main className="relative pt-24 pb-20 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Pendaftaran UMKM
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Bergabunglah dengan pasar digital desa kami.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <form
              onSubmit={onNext}
              className="relative flex flex-col justify-between rounded-3xl border border-white bg-white p-8 shadow-sm"
              style={{ minHeight: "600px" }}
            >
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {step === 1
                        ? "Langkah 1: Data Akun"
                        : "Langkah 2: Profil Usaha"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {step === 1
                        ? "Informasi untuk login dashboard."
                        : "Informasi toko yang akan ditampilkan."}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    <span>Step {step}</span>
                    <span className="text-slate-400">/</span>
                    <span>2</span>
                  </div>
                </div>

                {status === "success" && (
                  <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-check-circle-fill text-xl"></i>
                      <p className="font-semibold">{message}</p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-exclamation-triangle-fill text-xl"></i>
                      <p className="font-semibold">{message}</p>
                    </div>
                  </div>
                )}

                {step === 1 ? (
                  <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <Field
                        label="Kode Desa"
                        required
                        value={form.villageCode}
                        onChange={(v) => setForm({ ...form, villageCode: v })}
                        placeholder="Contoh: MSAWITDEV"
                        icon="bi-key"
                      />
                      <p className="mt-1 text-[10px] text-slate-500">
                        Dapatkan kode di kantor desa/BUMDes.
                      </p>
                    </div>

                    <Field
                      label="Nama Lengkap"
                      required
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      placeholder="Nama sesuai KTP"
                      icon="bi-person"
                    />

                    <Field
                      label="Nomor HP"
                      required
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      placeholder="0812xxxx"
                      icon="bi-phone"
                    />

                    <div>
                      <Field
                        label="Password"
                        required
                        type="password"
                        value={form.password}
                        onChange={(v) => setForm({ ...form, password: v })}
                        placeholder="Buat password aman"
                        icon="bi-lock"
                      />
                      <p className="mt-1 text-[10px] text-slate-500">
                        Digunakan untuk login ke dashboard.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Logo Upload */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Logo / Foto Tempat Usaha (Opsional)
                      </label>
                      <div className="relative group h-28 w-28 overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                        />
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <i className="bi bi-camera-fill text-2xl group-hover:text-emerald-500 transition-colors"></i>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        Klik untuk upload (Max 2MB)
                      </p>
                    </div>

                    <Field
                      label="Nama Usaha"
                      required
                      value={form.businessName}
                      onChange={(v) => setForm({ ...form, businessName: v })}
                      placeholder="Contoh: Keripik Pisang Bu Ani"
                      icon="bi-shop"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Field
                          label="Kategori Usaha"
                          type="select"
                          required
                          value={
                            CATEGORIES.includes(form.category)
                              ? form.category
                              : form.category
                                ? "Lainnya"
                                : ""
                          }
                          onChange={(val) => {
                            if (val === "Lainnya") {
                              setForm({ ...form, category: "" }); // Reset to allow manual typing
                            } else {
                              setForm({ ...form, category: val });
                            }
                          }}
                          placeholder="Pilih Kategori"
                          options={CATEGORIES}
                          icon="bi-tag"
                        />
                        {/* Show manual input if category is not in list (meaning "Lainnya" was picked or user is typing) */}
                        {!CATEGORIES.includes(form.category) && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                            <Field
                              label="Tulis Kategori Lainnya"
                              required
                              value={form.category}
                              onChange={(v) =>
                                setForm({ ...form, category: v })
                              }
                              placeholder="Contoh: Digital Agency"
                              icon="bi-pencil"
                            />
                          </div>
                        )}
                      </div>

                      <Field
                        label="WhatsApp Bisnis"
                        required
                        value={form.whatsapp}
                        onChange={(v) => setForm({ ...form, whatsapp: v })}
                        placeholder="0812xxxx"
                        icon="bi-whatsapp"
                      />
                    </div>

                    <Field
                      label="Alamat Lengkap"
                      required
                      value={form.address}
                      onChange={(v) => setForm({ ...form, address: v })}
                      placeholder="Jalan Mawar No. 12"
                      icon="bi-geo-alt"
                    />

                    <label className="block">
                      <span className="mb-1 block text-sm font-bold text-slate-700">
                        Deskripsi Singkat
                      </span>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Ceritakan sedikit tentang usaha Anda..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/30 transition-shadow focus:border-emerald-500 focus:bg-white focus:ring-4 placeholder:text-slate-400 font-medium h-24 resize-none"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Kembali
                  </button>
                )}
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="group relative flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                >
                  {status === "loading" ? (
                    <>
                      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      {step === 1 ? "Lanjut Langkah 2" : "Daftar Sekarang"}
                      <i className="bi bi-arrow-right-short text-xl transition-transform group-hover:translate-x-1"></i>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">Sudah punya akun?</p>
                <Link
                  href="/umkm/login"
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Login di sini
                </Link>
              </div>
            </form>

            <div className="space-y-6 sticky top-28 self-start">
              {/* Alur Steps */}
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-emerald-50">
                <h2 className="mb-6 text-lg font-bold text-slate-900">
                  Proses Pendaftaran
                </h2>
                <div className="relative space-y-8 pl-4 before:absolute before:left-[27px] before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-slate-100">
                  {steps.map((s, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 shadow-sm border transition-colors duration-300 ${
                          step >= s.step
                            ? "bg-emerald-600 text-white ring-emerald-100 border-emerald-600"
                            : "bg-slate-50 text-slate-400 ring-white border-slate-100"
                        }`}
                      >
                        <i className={`bi ${s.icon} text-lg`}></i>
                      </div>
                      <div
                        className={`pt-2 transition-opacity duration-300 ${step >= s.step ? "opacity-100" : "opacity-50"}`}
                      >
                        <h3 className="font-bold text-slate-900 leading-none">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-amber-50 p-6 border border-amber-100">
                <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <i className="bi bi-info-circle-fill text-amber-500"></i>
                  Info Penting
                </h2>
                <div className="mt-4 space-y-3 text-sm font-medium text-amber-900/80">
                  <p>
                    • Dengan 1x daftar, Anda otomatis mendapat akses dashboard
                    dan profil usaha.
                  </p>
                  <p>• Data usaha bisa diubah nanti.</p>
                </div>
              </div>

              <a
                href="https://wa.me/6281111111111?text=Halo%20admin%2C%20saya%20mau%20daftar%20UMKM%20Mekar%20Sawit."
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-100 bg-white py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 hover:border-emerald-200"
              >
                <i className="bi bi-whatsapp"></i>
                Bantuan Admin
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-600 font-medium">
        <p>
          © {new Date().getFullYear()} Pemerintah Desa Mekar Sawit. Dilindungi
          Undang-Undang.
        </p>
        <p className="mt-2">
          Dibuat oleh{" "}
          <span className="font-bold text-emerald-700">
            Tim Mekar Sawit Beraksi UMSU
          </span>{" "}
          untuk kemajuan desa.
        </p>
      </footer>
    </div>
  );
}

const CATEGORIES = [
  "Kuliner (Makanan/Minuman)",
  "Fashion & Pakaian",
  "Kerajinan Tangan",
  "Jasa / Layanan",
  "Pertanian & Perkebunan",
  "Peternakan",
  "Perikanan",
  "Toko Kelontong / Grosir",
  "Elektronik & Pulsa",
  "Properti / Kos",
  "Otomotif / Bengkel",
  "Kesehatan & Kecantikan",
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  icon,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  type?: string;
  options?: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {icon && <i className={`bi ${icon} mr-2 opacity-50`}></i>}
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {type === "select" ? (
        <div className="relative">
          <select
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/30 transition-shadow focus:border-emerald-500 focus:bg-white focus:ring-4 font-medium"
          >
            <option value="" disabled>
              {placeholder || "Pilih Salah Satu"}
            </option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Lainnya">Lainnya (Tulis Manual)</option>
          </select>
          <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
        </div>
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/30 transition-shadow focus:border-emerald-500 focus:bg-white focus:ring-4 placeholder:text-slate-400 font-medium"
        />
      )}
    </label>
  );
}
