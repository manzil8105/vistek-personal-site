import Link from "next/link";
import CornerBrackets from "@/components/CornerBrackets";
import { requireAdminSession } from "@/lib/session";

export default async function AdminRootPage() {
  await requireAdminSession();

  return (
    <div className="flex flex-col justify-between h-full min-h-[420px] py-4">
      {/* top telemetry badge */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#9ca3af] border-b border-white/[0.08] pb-3">
        <span className="text-cyan-400">&gt;&gt;</span>
        <span className="text-white/40"></span>
      </div>

      {/* editorial quote centerpiece */}
      <div className="my-auto py-8 text-center px-4 max-w-2xl mx-auto">
        <div className="inline-block mb-3 text-cyan-400/60 font-mono text-xs uppercase tracking-widest">
          &mdash; SYSTEM MANIFESTO &mdash;
        </div>
        <blockquote className="font-display text-2xl sm:text-3xl text-white font-normal italic leading-relaxed tracking-tight">
          &ldquo;My story is one of many thousands; the world won&apos;t suffer if it ends too soon. &amp; I must write that story no matter what.&rdquo;
        </blockquote>
        <div className="mt-4 font-mono text-xs text-[#ff007f] uppercase tracking-widest font-semibold">
          
        </div>
      </div>

      {/* quick action dock */}
      <div className="pt-6 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/posts/new"
            className="relative bg-[#0a0a0c] border border-white/10 hover:border-cyan-400 p-4 rounded-[2px] transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] group"
          >
            <CornerBrackets color="var(--neon-cyan)" size={5} />
            <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-1">
              &gt;&gt; ACTION_01
            </div>
            <div className="font-mono text-xs text-white font-bold group-hover:text-cyan-300">
              [+ Initialize Record]
            </div>
          </Link>

          <Link
            href="/admin/tags"
            className="relative bg-[#0a0a0c] border border-white/10 hover:border-[#ff007f] p-4 rounded-[2px] transition-all hover:shadow-[0_0_12px_rgba(255,0,127,0.25)] group"
          >
            <CornerBrackets color="var(--neon-magenta)" size={5} />
            <div className="font-mono text-[10px] text-[#ff007f] uppercase tracking-widest mb-1">
              &gt;&gt; ACTION_02
            </div>
            <div className="font-mono text-xs text-white font-bold group-hover:text-[#ff007f]">
              [# Tag Taxonomy]
            </div>
          </Link>

          <Link
            href="/"
            className="relative bg-[#0a0a0c] border border-white/10 hover:border-[#ffd000] p-4 rounded-[2px] transition-all hover:shadow-[0_0_12px_rgba(255,208,0,0.25)] group"
          >
            <CornerBrackets color="var(--neon-yellow)" size={5} />
            <div className="font-mono text-[10px] text-[#ffd000] uppercase tracking-widest mb-1">
              &gt;&gt; ACTION_03
            </div>
            <div className="font-mono text-xs text-white font-bold group-hover:text-[#ffd000]">
              [Open Public Feed &rarr;]
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
