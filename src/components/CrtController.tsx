"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("crt-state-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("crt-state-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("vistek_crt_state") === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCrtState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function CrtOverlay() {
  return (
    <div className="crt-overlay" id="crtOverlay" aria-hidden="true">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
    </div>
  );
}

export function CrtToggle({ className = "" }: { className?: string }) {
  const active = useCrtState();

  const toggle = () => {
    const next = !active;
    localStorage.setItem("vistek_crt_state", String(next));
    if (next) {
      document.body.classList.add("crt-active");
    } else {
      document.body.classList.remove("crt-active");
    }
    window.dispatchEvent(new Event("crt-state-change"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 border transition-all cursor-pointer rounded-[2px] ${
        active
          ? "border-cyan-400 text-cyan-300 bg-cyan-950/30 shadow-[0_0_10px_rgba(0,240,255,0.35)]"
          : "border-white/20 text-gray-400 hover:text-gray-200 hover:border-white/40 bg-black/40"
      } ${className}`}
      title={active ? "Deactivate CRT scanlines" : "Activate CRT scanlines"}
      aria-label="Toggle CRT Hardware Effect"
    >
      [CRT: {active ? "ON" : "OFF"}]
    </button>
  );
}

export default function CrtController() {
  const active = useCrtState();

  useEffect(() => {
    if (active) {
      document.body.classList.add("crt-active");
    } else {
      document.body.classList.remove("crt-active");
    }
  }, [active]);

  return <CrtOverlay />;
}

