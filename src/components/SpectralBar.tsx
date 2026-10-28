export default function SpectralBar({
  height = 2,
  className = "",
  glow = false,
}: {
  height?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`spectral-bar flex w-full overflow-hidden ${
        glow ? "shadow-[0_0_12px_rgba(255,0,127,0.35)]" : ""
      } ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <span className="spec-purple flex-1 bg-[#9d26ff]" />
      <span className="spec-magenta flex-1 bg-[#ff007f]" />
      <span className="spec-orange flex-1 bg-[#ff6600]" />
      <span className="spec-yellow flex-1 bg-[#ffd000]" />
    </div>
  );
}
