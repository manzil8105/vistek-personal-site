"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function TagSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentQ = searchParams.get("q") || "";

  const updateUrl = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set("q", val);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-cyan-400/50 text-xs">
        &gt;
      </span>
      <input
        type="text"
        placeholder="SEARCH_EXISTING_TAGS..."
        defaultValue={currentQ}
        onChange={(e) => updateUrl(e.target.value)}
        className="w-full bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] pl-7 pr-4 py-2 text-cyan-300 outline-none placeholder-white/20 uppercase tracking-widest font-mono text-xs rounded-[2px] transition-all"
      />
    </div>
  );
}
