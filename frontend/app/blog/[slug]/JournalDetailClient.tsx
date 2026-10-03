"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock,
  Feather,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";
import {
  useGetBlogBySlugQuery,
  useGetBlogsQuery,
  type BlogPost,
} from "@/services/blogApi";
import ArticleBody from "@/components/journal/ArticleBody";
import ReadingProgress from "@/components/journal/ReadingProgress";
import ShareBar from "@/components/journal/ShareBar";
import TableOfContents from "@/components/journal/TableOfContents";
import {
  estimateReadTime,
  htmlToText,
  parseArticleContent,
} from "@/components/journal/articleContent";
import { FOUNDED_YEAR } from "@/lib/site-config";

interface JournalDetailClientProps {
  slug: string;
  /** Canonical URL for share links / structured data. */
  canonicalUrl: string;
  /**
   * Server-rendered seed. The client renders this on the very first paint so
   * the article is present in the SSR HTML (and crawlers see real content);
   * RTK Query replaces it with fresher data once it resolves.
   */
  initialJournal?: BlogPost | null;
  /** Server-rendered archive used to build the "related notes" grid. */
  initialBlogs?: BlogPost[];
}

const CANONICAL_ORIGIN = "https://inkofmemories.com";

/** "12 Mar 2025" from a stored display date, or a real Date value. */
function formatDate(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return value;
}

/** Initials for the author avatar — "Ink of Memories" -> "SP". */
function initialsFor(name?: string): string {
  if (!name) return "IM";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/** Loading state that mirrors the real layout so nothing jumps on hydration. */
function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-muted pt-[calc(var(--navbar-height)+1rem)] font-sans text-foreground ">
      <div className="mx-auto max-w-[1160px] px-5 md:px-8">
        <div className="h-4 w-[240px] animate-pulse bg-footer/10 dark:bg-card/10" />
        <div className="mt-8 mb-6 h-[46px] w-[70%] animate-pulse bg-footer/10 sm:h-[60px] dark:bg-card/10" />
        <div className="mb-8 h-4 w-[320px] animate-pulse bg-footer/10 dark:bg-card/10" />
        <div className="h-[280px] w-full animate-pulse bg-ivory sm:h-[420px] dark:bg-card" />
        <div className="mx-auto mt-10 max-w-[68ch] space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse bg-footer/10 dark:bg-card/10"
              style={{ width: `${95 - (i % 3) * 12}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JournalDetailClient({
  slug,
  canonicalUrl,
  initialJournal,
  initialBlogs,
}: JournalDetailClientProps) {
  const { data: liveJournal, isLoading, isError } = useGetBlogBySlugQuery(slug);
  const { data: liveBlogs } = useGetBlogsQuery();

  // Prefer live data, fall back to the server-rendered seed.
  const blog = liveJournal ?? initialJournal ?? null;
  const allBlogs = useMemo(
    () =>
      liveBlogs && liveBlogs.length > 0 ? liveBlogs : (initialBlogs ?? []),
    [liveBlogs, initialBlogs],
  );

  const blocks = useMemo(
    () => parseArticleContent(blog?.content),
    [blog?.content],
  );

  // Prefer same-category posts, then fill up from the rest of the archive.
  const relatedBlogs = useMemo<BlogPost[]>(() => {
    if (!blog || allBlogs.length === 0) return [];
    const others = allBlogs.filter(
      (b) => b._id !== blog._id && b.slug !== slug,
    );
    const sameCategory = others.filter((b) => b.category === blog.category);
    const rest = others.filter((b) => b.category !== blog.category);
    return [...sameCategory, ...rest].slice(0, 3);
  }, [allBlogs, blog, slug]);

  const excerptText = htmlToText(blog?.excerpt);
  const dateLabel = formatDate(blog?.date) || formatDate(blog?.createdAt);
  const readTime =
    blog?.readTime || estimateReadTime(htmlToText(blog?.content));
  const authorName = blog?.author || "Ink of Memories";
  const shareUrl =
    canonicalUrl || `${CANONICAL_ORIGIN}/blog/${encodeURIComponent(slug)}`;

  // Only fall back to the skeleton when we genuinely have nothing to show —
  // the server seed means the article is already available on first paint.
  if (!blog) {
    if (isLoading || !isError) return <ArticleSkeleton />;

    return (
      <div className="min-h-screen bg-muted pt-[calc(var(--navbar-height)+1rem)] font-sans text-foreground ">
        <div className="mx-auto max-w-[720px] px-5 py-20 text-center md:px-8">
          <Feather size={30} className="mx-auto mb-5 text-gold-text" />
          <h1 className="font-serif text-[28px] leading-tight font-medium sm:text-[34px]">
            This note has been{" "}
            <span className="italic text-gold-text">pulled</span> from the
            press.
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-foreground/70 dark:text-muted-foreground">
            We couldn&apos;t find the press note you were looking for. It may
            have been renamed, or it might still be in the proofing stage.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-footer px-6 py-3 text-[13px] font-medium tracking-wide text-footer-foreground transition-colors hover:bg-brand-hover hover:text-primary-foreground"
          >
            <ArrowLeft size={15} />
            Back to press notes
          </Link>
        </div>
      </div>
    );
  }

  const headingCount = blocks.filter(
    (b) => b.kind === "h2" || b.kind === "h3",
  ).length;
  const hasToc = headingCount > 1;
  return (
    <div className="min-h-screen bg-muted font-sans text-foreground ">
      <ReadingProgress />

      <div className="pt-[calc(var(--navbar-height)+1rem)]">
        {/* Masthead — breadcrumb, eyebrow, title and meta, mirroring the
            JournalClient archive header. */}
        <header className="mx-auto max-w-[1160px] px-5 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 border-b border-foreground/15 pb-3 text-[11px] tracking-wide text-muted-foreground dark:border-border/15 dark:text-muted-foreground"
          >
            <Link
              href="/"
              className="transition-colors hover:text-gold-text dark:hover:text-gold"
            >
              Home
            </Link>
            <ChevronRight size={12} className="text-gold-text" />
            <Link
              href="/blog"
              className="transition-colors hover:text-gold-text dark:hover:text-gold"
            >
              Press notes
            </Link>
            {blog.category && (
              <>
                <ChevronRight size={12} className="text-gold-text" />
                <span className="text-gold-text dark:text-gold">
                  {blog.category}
                </span>
              </>
            )}
          </nav>

          <div className="border-b border-foreground/15 py-8 sm:py-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground dark:text-muted-foreground">
              <span>
                Press notes · Ink of Memories — since {FOUNDED_YEAR}
              </span>
              {blog.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-2.5 py-1 text-[10px] normal-case text-gold-text dark:text-gold">
                  <Sparkles size={11} />
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 max-w-[20ch] font-serif text-[clamp(2rem,5.4vw,3.4rem)] leading-[1.06] font-medium tracking-tight text-foreground dark:text-footer-foreground">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-foreground/70 dark:text-muted-foreground">
              {dateLabel && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-gold-text" />
                  {dateLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-gold-text" />
                {readTime}
              </span>
              <span className="hidden h-3 w-px bg-footer/20 sm:block dark:bg-muted/20" />
              <span className="inline-flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-footer text-[9px] font-semibold tracking-wide text-ivory dark:bg-gold dark:text-footer">
                  {initialsFor(authorName)}
                </span>
                {authorName}
                {blog.authorRole ? ` · ${blog.authorRole}` : ""}
              </span>
            </div>
          </div>
        </header>
        {/* Hero plate — bone mat with the double gold rule, same frame as the cards */}
        {blog.image && (
          <figure className="mx-auto mt-8 max-w-[1160px] px-5 md:px-8">
            <div className="relative overflow-hidden rounded-sm bg-ivory p-2.5 shadow-[0_28px_56px_-30px_rgba(31,58,50,.6)] sm:p-3 dark:bg-card">
              <div className="relative aspect-[16/9] overflow-hidden bg-brand-soft dark:bg-card">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1160px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-[rgba(31,58,50,.28)]" />
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-gold/60"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 border border-gold/30"
              />
            </div>
          </figure>
        )}

        {/* Reading column — sticky TOC rail on desktop, plain measure on mobile */}
        <div className="mx-auto max-w-[1160px] px-5 pt-10 pb-16 md:px-8 md:pt-14">
          <div
            className={
              hasToc
                ? "lg:grid lg:grid-cols-[minmax(0,1fr)_248px] lg:items-start lg:gap-14"
                : "mx-auto max-w-[68ch]"
            }
          >
            <article className={hasToc ? "min-w-0" : undefined}>
              {excerptText && (
                <p className="mb-9 border-l-2 border-gold pl-5 font-sans text-[19px] leading-[1.65] text-foreground italic sm:text-[22px] dark:text-muted-foreground">
                  {excerptText}
                </p>
              )}

              {blocks.length > 0 ? (
                <ArticleBody blocks={blocks} />
              ) : (
                <p className="text-[15.5px] leading-[1.85] text-foreground/70 italic dark:text-muted-foreground">
                  This note is still being written at the press — check back
                  shortly for the full story.
                </p>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-foreground/15 pt-6 dark:border-border/15">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground dark:text-muted-foreground">
                    <TagIcon size={13} className="text-gold-text" />
                    Filed under
                  </span>
                  {blog.tags.map((tag: string, idx: number) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="rounded-full border border-gold/60 px-3 py-1.5 text-[11.5px] tracking-wide text-gold-text transition-colors hover:bg-gold hover:text-footer dark:text-gold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author card */}
              <div className="mt-8 flex items-start gap-4 rounded-sm border border-foreground/15 bg-ivory p-5 shadow-[0_18px_36px_-28px_rgba(31,58,50,.5)] dark:border-border/15 dark:bg-card">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-footer font-sans text-[15px] text-gold dark:bg-gold dark:text-footer">
                  {initialsFor(authorName)}
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-[17px] leading-tight font-medium">
                    {authorName}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground dark:text-muted-foreground">
                    {blog.authorRole ||
                      "Editorial desk · Ink of Memories, Panchkula"}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/70 dark:text-muted-foreground">
                    Writing about paper stocks, foil and letterpress from the
                    floor of our Panchkula atelier since {FOUNDED_YEAR}.
                  </p>
                </div>
              </div>

              {/* Share — inline on mobile, sticky rail handled by the TOC column */}
              <div className="mt-8 flex justify-center border-t border-foreground/15 pt-6 lg:hidden dark:border-border/15">
                <ShareBar title={blog.title} url={shareUrl} />
              </div>
            </article>

            {/* Sticky side rail */}
            {hasToc && (
              <aside className="hidden lg:sticky lg:top-[calc(var(--navbar-height)+28px)] lg:block">
                <TableOfContents blocks={blocks} />
                <div className="mt-4 border-t border-foreground/15 pt-4 dark:border-border/15">
                  <ShareBar title={blog.title} url={shareUrl} />
                </div>
              </aside>
            )}
          </div>
        </div>
        {/* Related press notes — mirrors the JournalCard grid on the archive page */}
        {relatedBlogs.length > 0 && (
          <section className="border-t border-foreground/15 py-14 dark:border-border/15">
            <div className="mx-auto max-w-[1160px] px-5 md:px-8">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                    Keep reading
                  </p>
                  <h2 className="mt-2 font-sans text-[clamp(1.5rem,3vw,2rem)] leading-tight font-medium">
                    More from the{" "}
                    <span className="italic text-gold-text">press.</span>
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-1.5 text-[12.5px] tracking-wide text-foreground/70 transition-colors hover:text-gold-text dark:text-muted-foreground dark:hover:text-gold"
                >
                  All press notes
                  <ChevronRight
                    size={14}
                    className="text-gold-text transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-sm bg-ivory shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(31,58,50,.6)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-card"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-soft dark:bg-card">
                      {post.image && (
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-600 ease-in-out group-hover:scale-[1.045]"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-2 border border-gold/35"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {post.category && (
                        <span className="mb-2 inline-block text-[11px] tracking-wide text-gold-text underline decoration-gold underline-offset-[3px] dark:text-gold">
                          {post.category}
                        </span>
                      )}
                      <h3 className="mb-2 font-sans text-[1.05rem] leading-[1.2] font-medium underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-gold">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mb-3 line-clamp-2 text-[13px] leading-[1.55] text-foreground/70 dark:text-muted-foreground">
                          {htmlToText(post.excerpt)}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-3 pt-2 text-[10.5px] tracking-wide text-muted-foreground dark:text-muted-foreground">
                        {post.date && <span>{post.date}</span>}
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Atelier strip + CTA — mirrors the homepage CTASection */}
        <section className="border-t border-foreground/15 py-14 dark:border-border/15">
          <div className="mx-auto max-w-[1160px] space-y-6 px-5 md:px-8">
            <div className="rounded-sm border-t-2 border-gold bg-ivory p-6 shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] sm:p-8 dark:bg-card">
              <p className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                Printed slowly in Panchkula
              </p>
              <p className="mt-2 max-w-[38ch] font-sans text-[20px] leading-[1.35] font-medium sm:text-[24px]">
                Every suite is proofed on real paper — no middlemen, no
                compromise.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/customize"
                  className="inline-flex items-center gap-2 rounded-full bg-footer px-6 py-3 text-[13px] font-medium tracking-wide text-footer-foreground transition-colors hover:bg-brand-hover hover:text-primary-foreground"
                >
                  Begin customization
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/40 px-6 py-3 text-[13px] font-medium tracking-wide transition-colors hover:border-gold hover:text-gold-text dark:border-border/40 dark:hover:text-gold"
                >
                  Explore the collection
                </Link>
              </div>
            </div>

            {/* Gold-framed CTA panel */}
            <div className="relative overflow-hidden rounded-sm bg-footer p-10 text-center sm:p-14">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-gold/60"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 border border-gold/30"
              />
              <div className="relative">
                <Feather size={26} className="mx-auto text-gold" />
                <h2 className="mt-4 font-sans text-[22px] leading-tight font-medium text-footer-foreground sm:text-[28px]">
                  Your vision,{" "}
                  <span className="italic text-gold">exquisitely</span>{" "}
                  rendered.
                </h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted-foreground/85">
                  From sketch to final emboss — begin your design consultation
                  today, or browse 100+ original stationery designs.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/customize"
                    className="inline-flex w-full items-center justify-center rounded-full bg-ivory px-7 py-3 text-[13px] font-medium tracking-wide text-foreground transition-colors hover:bg-gold sm:w-auto"
                  >
                    Begin customization
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex w-full items-center justify-center rounded-full border border-gold px-7 py-3 text-[13px] font-medium tracking-wide text-footer-foreground transition-colors hover:bg-gold hover:text-footer sm:w-auto"
                  >
                    Explore all press notes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* __JDC_REST__ */}
    </div>
  );
}
