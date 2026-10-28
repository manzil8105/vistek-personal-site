export default function CornerBrackets({
  color = "var(--neon-cyan)",
  size = 8,
  borderWidth = 1.5,
  inset = -1,
  className = "",
}: {
  color?: string;
  size?: number;
  borderWidth?: number;
  inset?: number;
  className?: string;
}) {
  return (
    <>
      {/* top left */}
      <span
        aria-hidden="true"
        className={`hud-corner-bracket corner-tl ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${inset}px`,
          left: `${inset}px`,
          borderColor: color,
          borderWidth: `${borderWidth}px 0 0 ${borderWidth}px`,
        }}
      />
      {/* top right */}
      <span
        aria-hidden="true"
        className={`hud-corner-bracket corner-tr ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${inset}px`,
          right: `${inset}px`,
          borderColor: color,
          borderWidth: `${borderWidth}px ${borderWidth}px 0 0`,
        }}
      />
      {/* bottom left */}
      <span
        aria-hidden="true"
        className={`hud-corner-bracket corner-bl ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          bottom: `${inset}px`,
          left: `${inset}px`,
          borderColor: color,
          borderWidth: `0 0 ${borderWidth}px ${borderWidth}px`,
        }}
      />
      {/* bottom right */}
      <span
        aria-hidden="true"
        className={`hud-corner-bracket corner-br ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          bottom: `${inset}px`,
          right: `${inset}px`,
          borderColor: color,
          borderWidth: `0 ${borderWidth}px ${borderWidth}px 0`,
        }}
      />
    </>
  );
}
