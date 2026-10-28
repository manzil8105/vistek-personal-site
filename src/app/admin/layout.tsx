import Link from "next/link";
import { ReactNode } from "react";
import CornerBrackets from "@/components/CornerBrackets";
import SpectralBar from "@/components/SpectralBar";
import { CrtToggle } from "@/components/CrtController";
import AdminSessionGuard from "@/components/AdminSessionGuard";
import { requireAdminSession } from "@/lib/session";
import { logoutAdmin } from "@/app/actions/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-[#030303] p-4 sm:p-6 md:p-8 font-mono text-[#f3f4f6] ambient-grid flex flex-col">
      <div
        id="admin-container"
        className="relative bg-[#0a0a0c] border border-white/[0.14] rounded-[2px] max-w-6xl w-full mx-auto shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_40px_rgba(157,38,255,0.12)] flex-grow flex flex-col overflow-hidden"
      >
        <AdminSessionGuard />
        <CornerBrackets color="var(--neon-cyan)" size={10} />
        <SpectralBar height={2} />

        {/* overseer top status bar */}
        <div className="bg-[#050505] border-b border-white/[0.08] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-white font-normal">
              MANZIL
            </span>
            <span className="text-cyan-400 font-mono text-[11px] uppercase tracking-widest border-l border-white/10 pl-3">
              {"// OVERSEER"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#00ff66] flex items-center gap-1.5 font-bold uppercase tracking-widest">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
              STATUS: ONLINE
            </span>
            <CrtToggle />
            <Link
              href="/"
              className="text-gray-400 hover:text-white border border-white/10 hover:border-cyan-400 px-2 py-0.5 rounded-[2px] transition-colors"
            >
              [PUBLIC_FEED &rarr;]
            </Link>
          </div>
        </div>

        {/* dashboard body */}
        <div className="p-4 sm:p-6 md:p-8 flex-grow flex flex-col">
          <div className="mb-6 pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#ff007f] font-semibold mb-1">
                &gt;&gt; SYSTEM_ADMINISTRATION
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white font-normal tracking-tight">
                Dashboard
              </h1>
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
            {/* sidebar navigation */}
            <aside className="md:col-span-1 flex flex-col gap-2.5">
              <div className="text-[10px] text-cyan-400/80 uppercase tracking-widest border-b border-white/[0.08] pb-1.5 font-bold">
                COMMAND MODULES
              </div>

              <Link
                href="/admin/posts"
                className="group flex items-center justify-between px-3.5 py-2.5 bg-[#050505] border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 rounded-[2px] transition-all text-xs uppercase tracking-wider hover:shadow-[0_0_10px_rgba(0,240,255,0.25)]"
              >
                <span>[01] Manage_Posts</span>
                <span className="text-cyan-400/40 group-hover:text-cyan-300 transition-colors">&rarr;</span>
              </Link>

              <Link
                href="/admin/tags"
                className="group flex items-center justify-between px-3.5 py-2.5 bg-[#050505] border border-white/10 hover:border-[#ff007f] text-gray-300 hover:text-[#ff007f] rounded-[2px] transition-all text-xs uppercase tracking-wider hover:shadow-[0_0_10px_rgba(255,0,127,0.25)]"
              >
                <span>[02] Manage_Tags</span>
                <span className="text-[#ff007f]/40 group-hover:text-[#ff007f] transition-colors">&rarr;</span>
              </Link>

              <Link
                href="/admin"
                className="group flex items-center justify-between px-3.5 py-2.5 bg-[#050505] border border-white/10 hover:border-[#ffd000] text-gray-300 hover:text-[#ffd000] rounded-[2px] transition-all text-xs uppercase tracking-wider hover:shadow-[0_0_10px_rgba(255,208,0,0.25)]"
              >
                <span>[03] Overview</span>
                <span className="text-[#ffd000]/40 group-hover:text-[#ffd000] transition-colors">&rarr;</span>
              </Link>

              <div className="mt-auto pt-6">
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="w-full text-center px-3.5 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-[2px] transition-all text-[11px] uppercase tracking-widest bg-black/40 cursor-pointer"
                  >
                    [DISCONNECT]
                  </button>
                </form>
              </div>
            </aside>

            {/* main workspace frame */}
            <section className="md:col-span-3 bg-[#050505] border border-white/10 p-5 sm:p-7 relative rounded-[2px] overflow-hidden flex flex-col min-h-[500px]">
              <CornerBrackets color="rgba(255,255,255,0.2)" size={6} />
              <div className="relative z-10 w-full h-full flex-grow flex flex-col">
                {children}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
