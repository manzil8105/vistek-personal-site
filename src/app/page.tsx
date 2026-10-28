import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import SearchFilter from "@/components/SearchFilter";
import Pagination from "@/components/Pagination";
import CopyLinkButton from "@/components/CopyLinkButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TiltCard from "@/components/TiltCard";
import SpectralBar from "@/components/SpectralBar";
import CornerBrackets from "@/components/CornerBrackets";

export default async function PublicFeed({
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
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  const tagQuery = resolvedParams.tag || "";
  const sortQuery = resolvedParams.sort || "desc";
  const excludeQuery = resolvedParams.exclude || "";

  const currentPage = Number(resolvedParams.page) || 1;
  const POSTS_PER_PAGE = 5;

  const livePosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isDraft, false));

  const postsWithTags = await Promise.all(
    livePosts.map(async (post) => {
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

  // spectral badge styles for tag pills
  const spectralPillStyles = [
    "border-[#9d26ff]/50 text-[#c87aff] bg-[#9d26ff]/10 hover:border-[#9d26ff]",
    "border-[#ff007f]/50 text-[#ff66b3] bg-[#ff007f]/10 hover:border-[#ff007f]",
    "border-[#ff6600]/50 text-[#ffaa66] bg-[#ff6600]/10 hover:border-[#ff6600]",
    "border-[#ffd000]/50 text-[#ffe566] bg-[#ffd000]/10 hover:border-[#ffd000]",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030303] text-[#f3f4f6]">
      {/* fixed luxury HUD navigation */}
      <Navbar />

      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* architectural hero header */}
          <section className="mb-12 border-b border-white/[0.12] pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400 mb-3">
                  <span className="text-white/40">01 /</span>
                  <span>RECORD FEED</span>
                  <span className="text-[#ff007f] font-bold">●</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.05]">
                  Manzil Ahsan
                </h1>

                <p className="font-mono text-xs text-[#9ca3af] uppercase tracking-widest mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[#ff007f] font-bold">{"// RECORDS"}</span>
                  <span className="text-white/20">•</span>
                  <span>EST. 2026</span>
                  <span className="text-white/20">•</span>
                  <span className="text-cyan-400">STATUS: PEAK</span>
                </p>
              </div>

              {/* live telemetry dossier pill */}
              <div className="bg-[#0a0a0c] border border-white/10 px-4 py-3 rounded-[2px] font-mono text-[11px] text-gray-400 space-y-1 w-full md:w-auto shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between gap-4 text-cyan-400/80">
                  <span>TOTAL RECORDS:</span>
                  <span className="text-white font-bold font-mono">
                    [{livePosts.length}]
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-400">
                  <span>FILTERED TAGS:</span>
                  <span className="text-cyan-300 font-bold font-mono">
                    [{filteredPosts.length}]
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-400">
                  <span>LOCATION:</span>
                  <span className="text-white/70">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </section>

          {/* search & tag filter matrix */}
          <SearchFilter allTags={uniqueTags} />

          {/* posts feed grid */}
          <div className="flex flex-col gap-8">
            {paginatedPosts.length === 0 ? (
              <div className="relative bg-[#0a0a0c] border border-white/[0.12] p-12 text-center rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <CornerBrackets color="var(--neon-magenta)" size={10} />
                <div className="font-mono text-xs text-[#ff007f] uppercase tracking-widest animate-pulse font-bold">
                  &gt;&gt; NO ACTIVE TRANSMISSIONS MATCH QUERY PARAMETERS...
                </div>
                <p className="font-sans text-sm text-gray-400 mt-2">
                  Clear search term or reset active tag filters to restore databank telemetry.
                </p>
              </div>
            ) : (
              paginatedPosts.map((post, idx) => {
                const postIndex = startIndex + idx + 1;
                const formattedIndex =
                  postIndex < 10 ? `00${postIndex}` : postIndex < 100 ? `0${postIndex}` : postIndex;

                return (
                  <TiltCard
                    key={post.id}
                    className="p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[#0a0a0c] border border-white/[0.14]"
                  >
                    {/* card top metadata bar */}
                    <div className="flex items-center justify-between gap-4 mb-4 font-mono text-[10px] uppercase tracking-widest text-[#9ca3af]">
                      <span className="text-cyan-400/70 font-semibold">
                        &gt;&gt; Record Entry Number {formattedIndex}
                      </span>
                      <span className="text-white/40">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })
                          : "UNKNOWN"}
                      </span>
                    </div>

                    {/* thumbnail image frame (if exists) */}
                    {post.thumbnailUrl && (
                      <div className="relative w-full h-48 sm:h-56 mb-5 border border-white/10 overflow-hidden rounded-[2px] bg-black">
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-85 group-hover:opacity-100"
                        />
                        {/* analog scanline sheen */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.3)_3px,rgba(0,0,0,0.3)_4px)] pointer-events-none opacity-40" />
                        <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-black/80 text-cyan-400 border border-cyan-400/30">
                          {"//"}
                        </div>
                      </div>
                    )}

                    {/* tags badges */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, tIdx) => (
                          <span
                            key={tag}
                            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-[2px] transition-colors ${
                              spectralPillStyles[tIdx % spectralPillStyles.length]
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* post title heading */}
                    <Link href={`/${post.slug}`} className="block group/title mt-1 mb-4">
                      <h2 className="font-display text-2xl sm:text-3xl text-white font-normal group-hover/title:text-cyan-300 transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </Link>

                    {/* card bottom actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-auto border-t border-white/[0.08]">
                      <div className="font-mono text-[11px] text-[#9ca3af] uppercase tracking-wider flex items-center gap-3">
                        <span className="text-white/40">READ_TIME:</span>
                        <span className="text-cyan-400 font-semibold">
                          {post.readTimeMinutes || 1} MIN
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <CopyLinkButton slug={post.slug} />
                        <Link
                          href={`/${post.slug}`}
                          className="font-mono text-[11px] uppercase tracking-wider text-black bg-white hover:bg-cyan-300 px-3.5 py-1 rounded-[2px] font-semibold transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] flex items-center gap-1.5"
                        >
                          <span>READ</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>

                    {/* signature 4-color spectral bottom bar */}
                    <SpectralBar
                      height={2}
                      className="mt-6 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)]"
                    />
                  </TiltCard>
                );
              })
            )}
          </div>

          {/* pagination navigation */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </main>

      {/* pro footer */}
      <Footer />
    </div>
  );
}
