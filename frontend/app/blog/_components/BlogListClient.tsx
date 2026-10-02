"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar, Clock, type LucideIcon } from "lucide-react";

import PageHeader from "@/components/editorial/PageHeader";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/services/blogApi";

const POSTS_PER_PAGE = 6;

const categories = [
  "All",
  "Wedding Cards",
  "Design Trends",
  "Printing Tips",
  "Business Tips",
  "Sustainability",
  "Culture & History",
];

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

const MetaRow = ({
  items,
}: {
  items: { icon: LucideIcon; text: string }[];
}) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {items.map(({ icon: Icon, text }, i) => (
      <span
        key={i}
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500"
      >
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {text}
      </span>
    ))}
  </div>
);

const BlogListClient = ({ initialPosts }: BlogListClientProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const blogPosts = initialPosts;

  const featuredPost = blogPosts.find((post) => post.featured);

  // The featured post is surfaced separately — don't repeat it in the grid.
  const gridPosts = useMemo(
    () => blogPosts.filter((post) => post.slug !== featuredPost?.slug),
    [blogPosts, featuredPost],
  );

  const filteredPosts = useMemo(() => {
    let posts = gridPosts;

    if (activeCategory !== "All") {
      posts = posts.filter((post) => post.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return posts;
  }, [activeCategory, searchQuery, gridPosts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] dark:bg-[#0f111a]">
      <SEOHelper
        title="Printing Blog – Design Trends, Tips & Inspiration"
        description="Explore the Ink of Memories blog for expert printing tips, wedding card design trends, business card inspiration, and behind-the-scenes from Samlason Printing Press."
        path="/blog"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="printing blog, design trends, wedding card ideas, printing tips, invitation design inspiration"
        jsonLd={breadcrumbSchema}
      />

      <main className="pb-24 pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          {/* ───────── Page header + search ───────── */}
          <PageHeader
            eyebrow="The Journal"
            title="Notes on"
            accent="Craft & Print"
            description="Insights, guides and inspiration from the press floor — design trends, material choices, and the techniques behind every suite we produce."
          >
            <div className="relative max-w-md">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"
              />
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-none border border-stone-200 bg-transparent py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder-stone-400 focus:border-red-800 focus:ring-1 focus:ring-red-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500"
              />
            </div>
          </PageHeader>
{/* ───────── Featured post ───────── */}
          {featuredPost && activeCategory === "All" && !searchQuery && (
            <section className="py-16">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid items-stretch overflow-hidden border border-stone-200 transition-colors duration-300 hover:border-stone-400 lg:grid-cols-2 dark:border-stone-700 dark:hover:border-stone-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200 dark:bg-stone-800 lg:aspect-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute left-4 top-4 bg-red-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                    Featured
                  </span>
                </div>

                <div className="flex flex-col justify-center bg-[#F4F1EE] p-8 dark:bg-[#0d1321] lg:p-12">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-800 dark:text-red-600">
                    {featuredPost.category}
                  </span>

                  <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-900 md:text-4xl dark:text-stone-100">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-5 text-base font-light leading-[1.8] text-stone-600 dark:text-stone-300">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-7">
                    <MetaRow
                      items={[
                        { icon: Calendar, text: featuredPost.date },
                        { icon: Clock, text: featuredPost.readTime },
                      ]}
                    />
                  </div>

                  <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-900 dark:text-stone-100">
                    Read Article
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* ───────── Category filter ───────── */}
          <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-2 lg:flex-wrap lg:overflow-visible">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 snap-start rounded-none border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f111a]",
                    active
                      ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                      : "border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100",
                  )}
                >
                  {category === "All" ? "All Articles" : category}
                </button>
              );
            })}
          </div>

          {/* ───────── Result count ───────── */}
          <p
            aria-live="polite"
            className="my-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500"
          >
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </p>
{/* ───────── Posts grid ───────── */}
          {paginatedPosts.length > 0 ? (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
                    />
                    <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-900 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-100">
                      {post.category}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <MetaRow
                      items={[
                        { icon: Calendar, text: post.date },
                        { icon: Clock, text: post.readTime },
                      ]}
                    />

                    <h3 className="mt-3 font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-red-800 dark:text-stone-100 dark:group-hover:text-red-600">
                      {post.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm font-light leading-[1.8] text-stone-500 dark:text-stone-400">
                      {post.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">
                      Read More
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center border border-stone-200 py-24 text-center dark:border-stone-700">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
                  Empty Press
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
              </div>
              <p className="mt-6 font-serif text-2xl text-stone-900 dark:text-stone-100">
                No articles found.
              </p>
              <p className="mt-3 max-w-sm text-sm font-light text-stone-500 dark:text-stone-400">
                Try another category or search term to find what you&apos;re
                looking for.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 rounded-none border border-red-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-900 transition-colors duration-300 hover:bg-red-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 dark:border-red-800 dark:text-red-400 dark:focus-visible:ring-offset-[#0f111a]"
              >
                Reset Filters
              </button>
            </div>
          )}
{/* ───────── Pagination ───────── */}
          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="mt-16 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-none border border-stone-200 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors duration-300 hover:border-stone-900 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const active = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={active ? "page" : undefined}
                    aria-label={`Page ${page}`}
                    className={cn(
                      "h-11 w-11 rounded-none border text-[10px] font-semibold tracking-[0.1em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800",
                      active
                        ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                        : "border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100",
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-none border border-stone-200 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors duration-300 hover:border-stone-900 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100"
              >
                Next
              </button>
            </nav>
          )}

          {/* ───────── Newsletter ───────── */}
          <section className="mt-24 bg-stone-900 py-20 text-white dark:bg-[#0d1321]">
            <div className="container mx-auto px-6">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="h-px w-10 bg-white/25" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                    Newsletter
                  </span>
                  <span aria-hidden="true" className="h-px w-10 bg-white/25" />
                </div>

                <h2 className="mt-7 font-serif text-3xl leading-tight md:text-4xl">
                  Stay <em className="font-light text-red-500">Inspired.</em>
                </h2>

                <p className="mt-5 text-sm font-light leading-[1.8] text-white/60">
                  Get the latest design trends, printing tips and seasonal
                  offers delivered to your inbox.
                </p>

                <form
                  className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="flex-1 rounded-none border border-white/20 bg-transparent px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder-white/35 focus:border-white focus:ring-1 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="rounded-none bg-red-900 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BlogListClient;