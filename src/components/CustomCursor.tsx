"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";

const subscribeMedia = (callback: () => void) => {
  const media = window.matchMedia("(hover: hover) and (pointer: fine)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getMediaSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const getMediaServerSnapshot = () => false;

export default function CustomCursor() {
  const enabled = useSyncExternalStore(subscribeMedia, getMediaSnapshot, getMediaServerSnapshot);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });

  const reticleRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const crosshairHRef = useRef<HTMLDivElement>(null);
  const crosshairVRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer") !==
          null)
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    let animId: number;
    const render = () => {
      // lerp trail dot
      const factor = 0.22;
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * factor;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * factor;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
      }
      if (crosshairHRef.current) {
        crosshairHRef.current.style.transform = `translate3d(0, ${mousePos.current.y}px, 0)`;
      }
      if (crosshairVRef.current) {
        crosshairVRef.current.style.transform = `translate3d(${mousePos.current.x}px, 0, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled || !visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
      aria-hidden="true"
    >
      {/* horizontal subtle crosshair line */}
      <div
        ref={crosshairHRef}
        className="absolute left-0 right-0 h-[1px] bg-cyan-400/10 pointer-events-none"
        style={{ top: 0, willChange: "transform" }}
      />
      {/* vertical subtle crosshair line */}
      <div
        ref={crosshairVRef}
        className="absolute top-0 bottom-0 w-[1px] bg-cyan-400/10 pointer-events-none"
        style={{ left: 0, willChange: "transform" }}
      />

      {/* trailing orange ambient dot */}
      <div
        ref={trailRef}
        className="absolute top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-[#ff6600]/40 blur-[1px] pointer-events-none transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />

      {/* central magenta reticle dot + crosshair brackets */}
      <div
        ref={reticleRef}
        className="absolute top-0 left-0 -ml-3 -mt-3 w-6 h-6 flex items-center justify-center pointer-events-none transition-transform duration-150 ease-out"
        style={{ willChange: "transform" }}
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-200 ${
            hovered ? "scale-150" : "scale-100"
          }`}
        >
          {/* cyan fine crosshair lines */}
          <div className="absolute w-4 h-[1px] bg-[#00f0ff] opacity-80" />
          <div className="absolute h-4 w-[1px] bg-[#00f0ff] opacity-80" />
          {/* magenta reticle dot */}
          <div className="relative w-1.5 h-1.5 bg-[#ff007f] rounded-full shadow-[0_0_8px_#ff007f]" />
          {/* hover ring */}
          {hovered && (
            <div className="absolute w-5 h-5 border border-cyan-400/60 rounded-full animate-ping opacity-60" />
          )}
        </div>
      </div>
    </div>
  );
}
