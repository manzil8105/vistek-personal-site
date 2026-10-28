import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyLinkButton from "@/components/CopyLinkButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CornerBrackets from "@/components/CornerBrackets";
import SpectralBar from "@/components/SpectralBar";

export default async function PublicPostReader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postSlug = resolvedParams.slug;

  const [post] = await db.select().from(posts).where(eq(posts.slug, postSlug));

  if (!post || post.isDraft) {
    notFound();
  }

  const attachedTags = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id));

  const tagList = attachedTags.map((t) => t.name);

  // spectral badge styles for tag pills
  const spectralPillStyles = [
    "border-[#9d26ff]/50 text-[#c87aff] bg-[#9d26ff]/10",
    "border-[#ff007f]/50 text-[#ff66b3] bg-[#ff007f]/10",
    "border-[#ff6600]/50 text-[#ffaa66] bg-[#ff6600]/10",
    "border-[#ffd000]/50 text-[#ffe566] bg-[#ffd000]/10",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030303] text-[#f3f4f6]">
      <Navbar />

      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* top navigation and breadcrumbs */}
          <div className="mb-8 flex items-center justify-between font-mono text-xs">
            <Link
              href="/"
              className="text-cyan-400 hover:text-white uppercase tracking-wider border border-cyan-400/30 hover:border-cyan-400 px-3.5 py-1.5 bg-[#0a0a0c] rounded-[2px] transition-all hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] flex items-center gap-2"
            >
              <span>&larr;</span>
              <span>[RETURN_TO_FEED]</span>
            </Link>

            <span className="text-[#9ca3af] hidden sm:inline text-[10px] uppercase tracking-widest">
              &gt;&gt; NODE // {post.slug}
            </span>
          </div>

          {/* main article dossier */}
          <article className="relative bg-[#0a0a0c] border border-white/[0.14] p-6 sm:p-10 md:p-12 rounded-[2px] shadow-[0_25px_65px_rgba(0,0,0,0.95)]">
            <CornerBrackets color="var(--neon-cyan)" size={10} />

            {/* article header */}
            <header className="mb-10 pb-8 border-b border-white/[0.08]">
              {/* tags cloud */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {tagList.map((tag, idx) => (
                    <span
                      key={tag}
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-[2px] ${
                        spectralPillStyles[idx % spectralPillStyles.length]
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* title */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-[1.08] mb-6">
                {post.title}
              </h1>

              {/* metadata dossier row */}
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#9ca3af] uppercase tracking-wider pt-4 border-t border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    TIMESTAMP:{" "}
                    <strong className="text-white font-medium">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })
                        : "UNKNOWN"}
                    </strong>
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-cyan-400">
                    {"//"} {post.readTimeMinutes || 1} MIN READ
                  </span>
                </div>

                <CopyLinkButton slug={post.slug} />
              </div>
            </header>

            {/* spectral progress accent bar */}
            <SpectralBar height={2} className="mb-10" />

            {/* markdown body content */}
            <div className="prose-container break-words leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      className="font-display text-3xl sm:text-4xl text-white font-normal mt-12 mb-6 border-b border-white/10 pb-3 leading-tight"
                      {...props}
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      className="font-display text-2xl sm:text-3xl text-white font-normal mt-10 mb-4 leading-snug"
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      className="font-mono text-base sm:text-lg text-cyan-300 font-bold uppercase tracking-wider mt-8 mb-3"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="font-sans text-base sm:text-lg text-gray-300 leading-[1.8] mb-6"
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      className="list-disc list-inside mb-6 space-y-2 text-gray-300 marker:text-[#ff007f] font-sans text-base sm:text-lg"
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-6 space-y-2 text-gray-300 marker:text-[#ff007f] font-sans text-base sm:text-lg"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li className="font-sans text-base sm:text-lg leading-[1.7]" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="text-white font-semibold" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="text-cyan-400 hover:text-white underline underline-offset-4 decoration-cyan-400/50 hover:decoration-white transition-colors"
                      {...props}
                    />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="border-l-2 border-[#ff007f] pl-5 my-8 italic bg-[#ff007f]/[0.05] py-3 px-4 text-gray-200 text-lg font-display rounded-r-[2px]"
                      {...props}
                    />
                  ),
                  img: ({ ...props }) => (
                    <img
                      className="w-full h-auto border border-white/15 my-8 block rounded-[2px] shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                      {...props}
                    />
                  ),
                  pre: ({ ...props }) => (
                    <div className="relative border border-white/10 bg-[#050505] my-8 rounded-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                      <div className="flex items-center justify-between bg-white/[0.04] px-4 py-1.5 border-b border-white/10 font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest">
                        <span>{"// CODE_TERMINAL"}</span>
                        <span className="text-white/30">MONO</span>
                      </div>
                      <pre
                        className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300 [&>code]:bg-transparent [&>code]:text-inherit [&>code]:p-0 [&>code]:font-normal leading-relaxed"
                        {...props}
                      />
                    </div>
                  ),
                  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
                    <code
                      className="font-mono text-xs text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/30 px-1.5 py-0.5 rounded-[2px]"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {post.contentHtml}
              </ReactMarkdown>
            </div>

            {/* article footer return link */}
            <div className="mt-14 pt-6 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <Link
                href="/"
                className="text-cyan-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>&larr;</span>
                <span>[RETURN_TO_RECORD_FEED]</span>
              </Link>

              <CopyLinkButton slug={post.slug} />
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
