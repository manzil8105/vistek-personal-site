"use client";

import React, { useRef } from "react";
import CornerBrackets from "./CornerBrackets";

export default function TiltCard({
  children,
  className = "",
  showBrackets = true,
  bracketColor = "var(--neon-cyan)",
  maxTilt = 4,
}: {
  children: React.ReactNode;
  className?: string;
  showBrackets?: boolean;
  bracketColor?: string;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -maxTilt;
    const tiltY = (x / (rect.width / 2)) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`hud-card group ${className}`}
      style={{ willChange: "transform" }}
    >
      {showBrackets && <CornerBrackets color={bracketColor} />}
      {children}
    </div>
  );
}
