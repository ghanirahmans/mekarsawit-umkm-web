"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback duration
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <i
        className={`bi bi-arrow-clockwise text-base ${isRefreshing ? "animate-spin" : ""}`}
      ></i>
      Refresh
    </button>
  );
}
