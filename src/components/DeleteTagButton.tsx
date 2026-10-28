"use client";

export default function DeleteTagButton() {
  return (
    <button
      type="submit"
      className="font-mono text-[11px] uppercase tracking-wider text-red-400 border border-red-500/40 px-2.5 py-1 bg-red-950/20 hover:bg-red-900/40 hover:border-red-500 hover:text-white rounded-[2px] transition-all cursor-pointer"
      onClick={(e) => {
        if (!confirm("WARNING: Erase this tag from all connected posts?"))
          e.preventDefault();
      }}
    >
      [DELETE]
    </button>
  );
}
