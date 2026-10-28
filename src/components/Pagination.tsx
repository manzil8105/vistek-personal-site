"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      className="mt-12 flex justify-between items-center border-t border-white/[0.08] pt-6 font-mono text-xs"
    >
      {/* left side prev button */}
      <div className="flex-1 flex justify-start">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="text-cyan-400 hover:text-white uppercase tracking-widest border border-cyan-400/30 hover:border-cyan-400 px-3.5 py-1.5 bg-[#0a0a0c] rounded-[2px] hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
          >
            [&larr; PREV]
          </Link>
        ) : (
          <span className="opacity-0 pointer-events-none">[&larr; PREV]</span>
        )}
      </div>

      {/* center page numbers */}
      <div className="flex gap-2 overflow-x-auto px-4 py-1">
        {pageNumbers.map((num) => {
          const isActive = num === currentPage;
          return (
            <Link
              key={num}
              href={createPageUrl(num)}
              className={`flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-mono rounded-[2px] border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.5)] font-bold"
                  : "bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_8px_rgba(0,240,255,0.25)]"
              }`}
            >
              {num < 10 ? `0${num}` : num}
            </Link>
          );
        })}
      </div>

      {/* right side next button */}
      <div className="flex-1 flex justify-end">
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="text-cyan-400 hover:text-white uppercase tracking-widest border border-cyan-400/30 hover:border-cyan-400 px-3.5 py-1.5 bg-[#0a0a0c] rounded-[2px] hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
          >
            [NEXT &rarr;]
          </Link>
        ) : (
          <span className="opacity-0 pointer-events-none">[NEXT &rarr;]</span>
        )}
      </div>
    </nav>
  );
}
