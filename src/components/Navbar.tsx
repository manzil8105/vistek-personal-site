"use client";

import Link from "next/link";
import { useState } from "react";
import { CrtToggle } from "./CrtController";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "PORTFOLIO", href: "https://your-portfolio.com", external: true },
    { label: "INSTAGRAM", href: "https://instagram.com/manzil_mahim/", external: true },
    { label: "GITHUB", href: "https://github.com/manzil8105", external: true },
    { label: "LINKTREE", href: "https://linktr.ee/manzil.8105", external: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050505]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* left: brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-baseline gap-2.5 group transition-opacity hover:opacity-90"
          >
            <span className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              MANZIL
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9ca3af] hidden xs:inline border-l border-white/10 pl-2">
              SYS_26
            </span>
          </Link>

          <span className="hidden md:inline-flex items-center font-mono text-[10px] text-cyan-400/70 tracking-widest uppercase">
            
          </span>
        </div>

        {/* center or right: desktop links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs tracking-wider">
          {links.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-[#9ca3af] hover:text-white px-3 py-1.5 transition-colors uppercase border border-transparent hover:border-white/10 hover:bg-white/[0.03] rounded-[2px]"
            >
              <span className="text-cyan-400/50 mr-1.5">0{idx + 1}</span>
              [{item.label}]
            </a>
          ))}
        </nav>

        {/* far right: telemetry and CRT switch */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* live pulsing status */}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#00ff66] bg-[#00ff66]/[0.08] border border-[#00ff66]/30 px-2.5 py-1 rounded-[2px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff66]" />
            </span>
            <span className="hidden sm:inline">ONLINE</span>
            <span className="sm:hidden">ON</span>
          </div>

          {/* CRT hardware toggle */}
          <CrtToggle />

          {/* mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 font-mono text-xs border border-white/15 text-gray-300 hover:text-white hover:border-cyan-400 bg-white/[0.03] rounded-[2px]"
            aria-label="Toggle navigation drawer"
          >
            {mobileOpen ? "[X]" : "[=]"}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#050505] p-5 font-mono text-xs tracking-widest animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] uppercase text-cyan-400/60 mb-3 border-b border-white/10 pb-1">
            &gt;&gt; LINKS 
          </div>
          <div className="flex flex-col gap-2">
            {links.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/40 p-2.5 bg-white/[0.02]"
              >
                <span>[{item.label}]</span>
                <span className="text-cyan-400/40 text-[10px]">GATE_0{idx + 1} &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
