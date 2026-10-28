import SpectralBar from "./SpectralBar";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] text-[#9ca3af] font-mono text-xs relative overflow-hidden mt-20">
      <SpectralBar height={2} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 relative z-10">
        {/* brand section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-display text-2xl font-normal text-white tracking-tight">
            MANZIL
          </span>
          <span className="text-[#ff007f] text-[10px] uppercase tracking-widest mt-1 font-mono">
            {"// END_OF_TRANSMISSION // SYS_INIT_OK"}
          </span>
          <p className="text-gray-500 text-[11px] mt-2 max-w-xs font-sans">
            
          </p>
        </div>

        {/* external links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-cyan-400/60 text-[10px] uppercase tracking-widest mb-1 border-b border-white/[0.08] pb-1 w-full text-center md:text-left">
            &gt;&gt; LINKS
          </span>
          <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-wider text-gray-300">
            <a
              href="https://your-portfolio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all"
            >
              [PORTFOLIO]
            </a>
            <a
              href="https://instagram.com/manzil_mahim/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff007f] hover:drop-shadow-[0_0_8px_rgba(255,0,127,0.6)] transition-all"
            >
              [INSTAGRAM]
            </a>
            <a
              href="https://github.com/manzil8105"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all"
            >
              [GITHUB]
            </a>
            <a
              href="https://linktr.ee/manzil.8105"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff6600] hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.6)] transition-all"
            >
              [LINKTREE]
            </a>
          </div>
        </div>

        {/* copyright and telemetry status */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest">
            &copy; {currentYear} Manzil Ahsan. All rights reserved.
          </span>
          <span className="text-cyan-400/50 text-[10px] uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]" />
            </span>
            SYSTEM_VERSION 2
          </span>
        </div>
      </div>
    </footer>
  );
}
