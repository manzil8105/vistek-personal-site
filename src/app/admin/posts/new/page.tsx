import { createPost } from "@/app/actions/posts";
import Link from "next/link";
import CornerBrackets from "@/components/CornerBrackets";
import { requireAdminSession } from "@/lib/session";

export default async function NewPostForm() {
  await requireAdminSession();

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* top header */}
      <div className="mb-6 border-b border-white/[0.08] pb-4 flex justify-between items-center">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
            &gt;&gt; 
          </div>
          <h2 className="font-display text-2xl text-white font-normal tracking-tight">
            Input Record
          </h2>
        </div>

        <Link
          href="/admin/posts"
          className="text-gray-400 hover:text-white border border-white/10 hover:border-red-400 px-3 py-1.5 rounded-[2px] transition-colors uppercase tracking-wider text-[11px]"
        >
          [Abort_Input]
        </Link>
      </div>

      {/* form container */}
      <form
        action={createPost}
        className="flex flex-col gap-5 max-w-3xl relative z-10 bg-[#0a0a0c] border border-white/[0.08] p-6 rounded-[2px]"
      >
        <CornerBrackets color="var(--neon-cyan)" size={6} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Record title..."
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.25)] outline-none text-cyan-300 font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; URL_Slug
            </label>
            <input
              type="text"
              name="slug"
              required
              placeholder="e.g. neural-engine-v2"
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.25)] outline-none text-cyan-300 font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#ff007f] uppercase tracking-wider">
              &gt;&gt; Thumbnail_URL (Optional)
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="https://..."
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] outline-none text-white font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#ff007f] uppercase tracking-wider">
              &gt;&gt; Tags (Comma separated)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="cybernetics, ai, engineering"
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] outline-none text-white font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; Record_Content
            </label>
            
          </div>
          <textarea
            name="contentHtml"
            required
            rows={14}
            placeholder="Write payload in Markdown syntax..."
            className="px-3.5 py-3 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] outline-none text-cyan-200 font-mono text-xs leading-relaxed rounded-[2px] transition-all w-full resize-y"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-white hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] cursor-pointer flex items-center gap-2"
          >
            <span>Execute_Write()</span>
            <span>&rarr;</span>
          </button>
        </div>
      </form>
    </div>
  );
}
