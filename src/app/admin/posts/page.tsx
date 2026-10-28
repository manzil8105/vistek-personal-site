import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import SearchFilter from "@/components/SearchFilter";
import Pagination from "@/components/Pagination";
import { deletePost } from "@/app/actions/posts";
import DeletePostButton from "@/components/DeletePostButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import { requireAdminSession } from "@/lib/session";

export default async function ManagePosts({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    page?: string;
    sort?: string;
    exclude?: string;
  }>;
}) {
  await requireAdminSession();
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  const tagQuery = resolvedParams.tag || "";
  const sortQuery = resolvedParams.sort || "desc";
  const excludeQuery = resolvedParams.exclude || "";

  const currentPage = Number(resolvedParams.page) || 1;
  const POSTS_PER_PAGE = 10;

  const allPosts = await db.select().from(posts);

  const postsWithTags = await Promise.all(
    allPosts.map(async (post) => {
      const attachedTags = await db
        .select({ name: tags.name })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, post.id));

      return { ...post, tags: attachedTags.map((t) => t.name) };
    }),
  );

  const uniqueTags = Array.from(
    new Set(postsWithTags.flatMap((p) => p.tags)),
  ).sort();
  const activeTags = tagQuery.split(",").filter(Boolean);
  const excludedTags = excludeQuery.split(",").filter(Boolean);

  let filteredPosts = postsWithTags.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.contentHtml.toLowerCase().includes(searchQuery);

    const matchesTags =
      activeTags.length === 0 || activeTags.every((t) => post.tags.includes(t));
    const hasNoExcludedTags =
      excludedTags.length === 0 ||
      !excludedTags.some((t) => post.tags.includes(t));

    return matchesSearch && matchesTags && hasNoExcludedTags;
  });

  filteredPosts = filteredPosts.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (sortQuery === "asc") return dateA - dateB;
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.08] pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
            &gt;&gt; RECORD_DIRECTORY
          </div>
          <h2 className="font-display text-2xl text-white font-normal tracking-tight">
            All Records
          </h2>
        </div>

        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-white hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] cursor-pointer flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Initialize_Record</span>
        </Link>
      </div>

      {/* filter and search */}
      <SearchFilter allTags={uniqueTags} />

      {/* table view */}
      <div className="flex-grow overflow-x-auto relative z-10 border border-white/[0.08] rounded-[2px] bg-[#0a0a0c]">
        {paginatedPosts.length === 0 ? (
          <div className="p-12 text-center text-cyan-400/60 uppercase tracking-widest animate-pulse">
            &gt;&gt; NO RECORDS FOUND IN DATABANK ARCHIVE...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#050505] text-[#9ca3af]">
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Record Title
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Taxonomy Tags
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Status
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold">
                  Logged Date
                </th>
                <th className="p-3 uppercase text-[10px] tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {paginatedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-white font-medium hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                      <span className="text-cyan-400/40 text-[10px]">&gt;</span>
                      <span>{post.title}</span>
                    </Link>
                  </td>
                  <td className="p-3 text-[11px] text-[#c87aff]">
                    {post.tags.length > 0 ? post.tags.join(" // ") : "---"}
                  </td>
                  <td className="p-3">
                    {post.isDraft ? (
                      <span className="text-[#ffd000] border border-[#ffd000]/40 px-2 py-0.5 bg-[#ffd000]/10 rounded-[2px] text-[10px] uppercase font-bold tracking-wider">
                        DRAFT
                      </span>
                    ) : (
                      <span className="text-[#00ff66] border border-[#00ff66]/40 px-2 py-0.5 bg-[#00ff66]/10 rounded-[2px] text-[10px] uppercase font-bold tracking-wider shadow-[0_0_8px_rgba(0,255,102,0.2)]">
                        LIVE
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-400 text-[11px]">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })
                      : "UNKNOWN"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 items-center">
                      <CopyLinkButton slug={post.slug} />
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-[11px] text-[#ff007f] border border-[#ff007f]/40 px-2.5 py-1 hover:bg-[#ff007f] hover:text-white transition-all uppercase tracking-wider rounded-[2px]"
                      >
                        [EDIT]
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <DeletePostButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
