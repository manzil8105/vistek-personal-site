import { db } from "@/db";
import { tags, postTags } from "@/db/schema";
import { asc, sql, ilike } from "drizzle-orm";
import { createTag, deleteTag } from "@/app/actions/tags";
import DeleteTagButton from "@/components/DeleteTagButton";
import TagSearch from "@/components/TagSearch";
import CornerBrackets from "@/components/CornerBrackets";
import { requireAdminSession } from "@/lib/session";

export default async function ManageTags({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdminSession();
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";

  // fetch tags alphabetically, apply search filter if typing
  const allTags = await db
    .select()
    .from(tags)
    .where(searchQuery ? ilike(tags.name, `%${searchQuery}%`) : undefined)
    .orderBy(asc(tags.name));

  // count active uses
  const tagCounts = await db
    .select({
      tagId: postTags.tagId,
      count: sql<number>`count(${postTags.postId})`,
    })
    .from(postTags)
    .groupBy(postTags.tagId);

  const countMap = new Map(tagCounts.map((tc) => [tc.tagId, Number(tc.count)]));

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* top header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.08] pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#ff007f] font-semibold mb-1">
            &gt;&gt; TAXONOMY_MATRIX // INDEX
          </div>
          <h2 className="font-display text-2xl text-white font-normal tracking-tight">
            Tags
          </h2>
        </div>
        <span className="text-white/40 text-[11px]">
          Total Tags: [{allTags.length}]
        </span>
      </div>

      {/* add tag form */}
      <form
        action={createTag}
        className="mb-6 flex flex-col sm:flex-row gap-3 p-4 border border-white/10 bg-[#0a0a0c] rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.6)] relative"
      >
        <CornerBrackets color="var(--neon-magenta)" size={6} />
        <div className="relative flex-1">
          <input
            type="text"
            name="name"
            placeholder="NEW_TAG_NAME..."
            required
            className="w-full bg-[#050505] border border-white/10 focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.3)] px-3.5 py-2 text-[#ff007f] outline-none placeholder-white/20 uppercase tracking-widest font-mono text-xs rounded-[2px] transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-white hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>[+] Add Tag</span>
        </button>
      </form>

      {/* injected search filter */}
      <div className="mb-4">
        <TagSearch />
      </div>

      {/* scrollable tags table */}
      <div className="flex-grow overflow-x-auto relative z-10 max-h-[480px] border border-white/[0.08] rounded-[2px] bg-[#0a0a0c]">
        {allTags.length === 0 ? (
          <div className="p-12 text-center text-cyan-400/60 uppercase tracking-widest animate-pulse">
            &gt;&gt; NO TAXONOMY TAGS MATCH QUERY...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#050505] z-20">
              <tr className="border-b border-white/10 text-[#9ca3af]">
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Tag Identifier
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Slug
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold text-center">
                  Active Uses
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Created
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {allTags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-3 text-cyan-300 font-bold uppercase">
                    #{tag.name}
                  </td>
                  <td className="p-3 text-[11px] text-gray-500">{tag.slug}</td>
                  <td className="p-3 text-center">
                    <span className="font-mono text-xs text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/30 px-2 py-0.5 rounded-[2px] font-bold">
                      {countMap.get(tag.id) || 0}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-[11px]">
                    {tag.createdAt
                      ? new Date(tag.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })
                      : "UNKNOWN"}
                  </td>
                  <td className="p-3 text-right">
                    <form action={deleteTag}>
                      <input type="hidden" name="id" value={tag.id} />
                      <DeleteTagButton />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
