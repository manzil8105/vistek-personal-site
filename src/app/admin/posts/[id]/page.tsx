import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePost, deletePost } from "@/app/actions/posts";
import DeletePostButton from "@/components/DeletePostButton";
import CornerBrackets from "@/components/CornerBrackets";
import { requireAdminSession } from "@/lib/session";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));

  if (!post) {
    notFound();
  }

  const attachedTags = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));

  const tagString = attachedTags.map((t) => t.name).join(", ");

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* top header */}
      <div className="mb-6 border-b border-white/[0.08] pb-4 flex justify-between items-center">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#ff007f] font-semibold mb-1">
            &gt;&gt; OVERRIDE_OPERATION // RECORD_MUTATION
          </div>
          <h2 className="font-display text-2xl text-white font-normal tracking-tight">
            Data Core // Edit Record
          </h2>
        </div>

        <Link
          href="/admin/posts"
          className="text-gray-400 hover:text-white border border-white/10 hover:border-red-400 px-3 py-1.5 rounded-[2px] transition-colors uppercase tracking-wider text-[11px]"
        >
          [Abort_Edit]
        </Link>
      </div>

      {/* main edit form */}
      <form
        action={updatePost}
        className="flex flex-col gap-5 max-w-3xl relative z-10 bg-[#0a0a0c] border border-white/[0.08] p-6 rounded-[2px]"
      >
        <CornerBrackets color="var(--neon-cyan)" size={6} />
        <input type="hidden" name="id" value={post.id} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; Title_
            </label>
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              required
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.25)] outline-none text-cyan-300 font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#ffd000] uppercase tracking-wider">
              &gt;&gt; Status_
            </label>
            <select
              name="isDraft"
              defaultValue={post.isDraft ? "true" : "false"}
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-[#ffd000] outline-none text-[#ffd000] font-mono text-xs rounded-[2px] cursor-pointer w-full"
            >
              <option value="true">DRAFT</option>
              <option value="false">LIVE</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; URL_Slug
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={post.slug}
              required
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.25)] outline-none text-cyan-300 font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#ff007f] uppercase tracking-wider">
              &gt;&gt; Thumbnail_URL (Optional)
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              defaultValue={post.thumbnailUrl || ""}
              placeholder="https://..."
              className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] outline-none text-white font-mono text-xs rounded-[2px] transition-all w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#ff007f] uppercase tracking-wider">
            &gt;&gt; Tags (Comma separated)
          </label>
          <input
            type="text"
            name="tags"
            defaultValue={tagString}
            className="px-3.5 py-2 bg-[#050505] border border-white/10 focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] outline-none text-white font-mono text-xs rounded-[2px] transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              &gt;&gt; RECORD_PAYLOAD
            </label>
            <span className="text-[10px] text-white/40 uppercase">MARKDOWN // RAW</span>
          </div>
          <textarea
            name="contentHtml"
            defaultValue={post.contentHtml}
            required
            rows={14}
            className="px-3.5 py-3 bg-[#050505] border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] outline-none text-cyan-200 font-mono text-xs leading-relaxed rounded-[2px] transition-all w-full resize-y"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-white hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] cursor-pointer flex items-center gap-2"
          >
            <span>Execute_Override()</span>
            <span>&rarr;</span>
          </button>
        </div>
      </form>

      {/* danger zone */}
      <div className="mt-8 pt-5 border-t border-red-950/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 max-w-3xl">
        <div>
          <span className="text-red-400 font-bold uppercase tracking-wider text-[11px] block">
            &gt;&gt; DANGER_ZONE: IRREVERSIBLE_PURGE
          </span>
          <span className="text-gray-500 text-[10px]">
            Permanently destroy this transmission record from the database.
          </span>
        </div>

        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <DeletePostButton className="px-4 py-2 bg-red-950/30 border border-red-500/70 text-red-400 font-bold hover:bg-red-900/60 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all uppercase tracking-wider rounded-[2px] cursor-pointer" />
        </form>
      </div>
    </div>
  );
}
