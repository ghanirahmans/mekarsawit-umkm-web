"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { startTransition, useEffect, useState } from "react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get("q") || "");

  // Sync internal state with URL params (e.g. on back button)
  useEffect(() => {
    startTransition(() => {
      setTerm(searchParams.get("q") || "");
    });
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((nextTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (nextTerm) {
      params.set("q", nextTerm);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex-1">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-xl border border-slate-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-slate-500 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
        placeholder={placeholder}
        onChange={(e) => {
          setTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        value={term}
      />
      <i className="bi bi-search absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 peer-focus:text-emerald-500 transition-colors"></i>
    </div>
  );
}
