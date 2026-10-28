import { loginAdmin } from "../actions/auth";
import { notFound } from "next/navigation";
import CornerBrackets from "@/components/CornerBrackets";
import SpectralBar from "@/components/SpectralBar";
import { CrtToggle } from "@/components/CrtController";
import GatewayAuthGuard from "@/components/GatewayAuthGuard";
import { verifyGatewaySession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; error?: string }>;
}) {
  const resolvedParams = await searchParams;

  // secret knock, if URL key is provided and invalid, reject with 404
  if (resolvedParams.key && resolvedParams.key !== process.env.ADMIN_SECRET_KEY) {
    notFound();
  }

  // verify that an active gateway authorization session cookie exists
  const hasAccess = await verifyGatewaySession();
  if (!hasAccess && resolvedParams.key !== process.env.ADMIN_SECRET_KEY) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-[#f3f4f6] relative ambient-grid">
      {/* top right utility bar */}
      <div className="absolute top-6 right-6">
        <CrtToggle />
      </div>

      <div
        id="gateway-container"
        className="relative bg-[#0a0a0c] border border-white/[0.14] p-8 sm:p-10 w-full max-w-md rounded-[2px] shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_40px_rgba(157,38,255,0.15)] overflow-hidden"
      >
        <GatewayAuthGuard />
        <CornerBrackets color="var(--neon-cyan)" size={10} />
        <SpectralBar height={2} className="absolute top-0 left-0 right-0" />

        {/* header telemetry */}
        <div className="text-center mb-8 pt-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>&gt;&gt; OVERRIDE_GATEWAY // SEC_LEVEL_01</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-white font-normal tracking-tight">
            Security Authorization
          </h1>

          <p className="font-mono text-[11px] text-[#9ca3af] uppercase tracking-wider mt-1">
            Authentication Required for Node Write Access
          </p>
        </div>

        {/* error display for invalid credentials */}
        {resolvedParams.error && (
          <div className="mb-6 font-mono text-xs text-red-400 uppercase text-center border border-red-500/50 p-3 bg-red-950/30 rounded-[2px] shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-shake">
            &gt;&gt; ERR: {resolvedParams.error.replace("_", " ")}
          </div>
        )}

        <form action={loginAdmin} className="flex flex-col gap-5 text-white">
          <input type="hidden" name="secretKey" value={resolvedParams.key || ""} />

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>&gt;&gt; USER_IDENTIFIER</span>
              <span className="text-white/30 text-[9px]">[REQUIRED]</span>
            </label>
            <input
              type="text"
              name="username"
              required
              autoFocus
              autoComplete="username"
              placeholder="operator_id"
              className="px-3.5 py-2.5 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] outline-none text-cyan-300 font-mono text-xs uppercase tracking-widest rounded-[2px] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>&gt;&gt; ENCRYPTION_PASSPHRASE</span>
              <span className="text-white/30 text-[9px]">[REQUIRED]</span>
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="px-3.5 py-2.5 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] outline-none text-cyan-300 font-mono text-xs tracking-widest rounded-[2px] transition-all"
            />
          </div>

          <div className="mt-4 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-white hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] transition-all hover:shadow-[0_0_18px_rgba(0,240,255,0.6)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>AUTHENTICATE</span>
              <span>&rarr;</span>
            </button>
          </div>
        </form>

        {/* footer info */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest">
          secutiy
        </div>
      </div>
    </main>
  );
}
