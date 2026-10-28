"use client";

import { useState } from "react";

export default function CopyLinkButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/${slug}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const baseStyle =
    "font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border rounded-[2px] transition-all cursor-pointer font-medium";
  const idleStyle =
    "text-cyan-400 border-cyan-400/30 bg-black/40 hover:border-cyan-400 hover:text-white hover:bg-cyan-950/20 hover:shadow-[0_0_10px_rgba(0,240,255,0.35)]";
  const copiedStyle =
    "text-white bg-[#ff007f] border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.5)] font-bold";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseStyle} ${copied ? copiedStyle : idleStyle} ${className || ""}`}
      title="Copy link to clipboard"
    >
      {copied ? "[COPIED!]" : "[COPY_LINK]"}
    </button>
  );
}
