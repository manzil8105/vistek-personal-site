"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CornerBrackets from "./CornerBrackets";

export default function SearchFilter({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "desc";
  const currentTags = searchParams.get("tag")?.split(",").filter(Boolean) || [];
  const excludedTags =
    searchParams.get("exclude")?.split(",").filter(Boolean) || [];

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    let newIncluded = [...currentTags];
    let newExcluded = [...excludedTags];

    if (newIncluded.includes(tag)) {
      newIncluded = newIncluded.filter((t) => t !== tag);
      newExcluded.push(tag);
    } else if (newExcluded.includes(tag)) {
      newExcluded = newExcluded.filter((t) => t !== tag);
    } else {
      newIncluded.push(tag);
    }

    if (newIncluded.length > 0) params.set("tag", newIncluded.join(","));
    else params.delete("tag");

    if (newExcluded.length > 0) params.set("exclude", newExcluded.join(","));
    else params.delete("exclude");

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // spectral color progression map for active tags
  const spectralColors = [
    "bg-[#9d26ff] text-white border-[#9d26ff] shadow-[0_0_10px_rgba(157,38,255,0.45)]",
    "bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,0.45)]",
    "bg-[#ff6600] text-white border-[#ff6600] shadow-[0_0_10px_rgba(255,102,0,0.45)]",
    "bg-[#ffd000] text-black border-[#ffd000] shadow-[0_0_10px_rgba(255,208,0,0.45)]",
  ];

  return (
    <div className="relative mb-10 bg-[#0a0a0c] border border-white/[0.12] p-5 rounded-[2px] shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
      <CornerBrackets color="var(--neon-cyan)" size={8} />

      {/* top diagnostics label */}
      <div className="flex items-center justify-between mb-4 font-mono text-[10px] uppercase tracking-widest text-[#9ca3af] border-b border-white/[0.08] pb-2">
        <span className="flex items-center gap-2 text-cyan-400">
          <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          &gt;&gt; Search Records
        </span>
        <span className="text-white/40 hidden sm:inline">M</span>
      </div>

      {/* search input & sort selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-cyan-400/50 text-xs">
            &gt;
          </span>
          <input
            type="text"
            placeholder="SEARCH_QUERY..."
            defaultValue={currentQ}
            onChange={(e) => updateUrl("q", e.target.value)}
            className="w-full bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] pl-8 pr-4 py-2.5 text-cyan-300 placeholder-white/20 font-mono text-xs uppercase tracking-widest rounded-[2px] outline-none transition-all"
          />
        </div>

        <select
          value={currentSort}
          onChange={(e) => updateUrl("sort", e.target.value)}
          className="bg-[#050505] border border-white/10 focus:border-cyan-400 px-4 py-2.5 text-[#ff007f] font-mono text-xs uppercase tracking-widest rounded-[2px] outline-none cursor-pointer transition-colors"
        >
          <option value="desc">SORT: NEWEST</option>
          <option value="asc">SORT: OLDEST</option>
        </select>
      </div>

      {/* tags filter pill cloud */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 mr-1">
            TAGS:
          </span>
          {allTags.map((tag, idx) => {
            const isIncluded = currentTags.includes(tag);
            const isExcluded = excludedTags.includes(tag);

            let btnStyle =
              "bg-[#050505] text-[#9ca3af] border-white/10 hover:border-cyan-400/50 hover:text-white";
            if (isIncluded) {
              btnStyle = spectralColors[idx % spectralColors.length] + " font-bold";
            }
            if (isExcluded) {
              btnStyle =
                "bg-red-950/30 text-red-400 border-red-500/70 line-through font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]";
            }

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border rounded-[2px] transition-all cursor-pointer ${btnStyle}`}
                title="Click to cycle: Include -> Exclude -> Clear"
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
