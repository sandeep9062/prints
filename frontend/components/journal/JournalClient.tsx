"use client";

import React, { useState, useMemo } from "react";
import { useGetBlogsQuery } from "@/services/blogApi";
import { Search } from "lucide-react";
import JournalCard, { JournalPost } from "@/components/journal/JournalCard";
import { FOUNDED_YEAR } from "@/lib/site-config";

interface JournalClientProps {
  initialJournals: JournalPost[];
  initialCategories: string[];
}

export default function JournalClient({
  initialJournals,
  initialCategories,
}: JournalClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Live blog data — falls back to SSR seed while loading.
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();

  const liveJournals: JournalPost[] = useMemo(
    () =>
      (blogs || []).map((b) => ({
        _id: b._id,
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        category: b.category,
        readTime: b.readTime,
        publishedAt: b.date,
        coverImage: b.image,
      })),
    [blogs],
  );

  // Prefer fresh client data once loaded, else SSR seed.
  const allJournals = liveJournals.length > 0 ? liveJournals : initialJournals;

  const categories = useMemo(() => {
    const fromLive = Array.from(
      new Set(liveJournals.map((j) => j.category).filter(Boolean) as string[]),
    );
    const base = fromLive.length > 0 ? fromLive : initialCategories;
    return ["All", ...base];
  }, [liveJournals, initialCategories]);

  const displayJournals = useMemo(() => {
    let list = allJournals;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allJournals, activeCategory, searchQuery]);

  const isFiltered = searchQuery !== "" || activeCategory !== "All";

  if (isLoading && allJournals.length === 0) {
    return (
      <div className="min-h-screen bg-muted font-sans text-foreground">
        <div className="mx-auto max-w-[1220px] px-5 py-10 md:px-8">
          <div className="mb-[30px] h-[60px] w-[260px] animate-pulse bg-foreground/10" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-sm bg-ivory p-4 sm:col-span-1 lg:col-span-2"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError && allJournals.length === 0) {
    return (
      <div className="min-h-screen bg-muted font-sans text-foreground">
        <div className="px-5 py-[72px] text-center">
          <h3 className="font-sans text-[1.4rem] font-medium">Press paused</h3>
          <p className="mt-2 text-sm text-foreground/70">
            Unable to load press notes right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 font-sans text-foreground">
      <div className="mx-auto max-w-full px-5 md:px-8">
        {/* Masthead — matches homepage eyebrow voice */}
        <div className="flex items-end justify-between gap-3 border-b border-border/20 pb-[14px] pt-[18px]">
          <div className="text-[11px] tracking-wide text-foreground/70">
            <b className="font-semibold text-foreground">Ink of Memories</b> ·
            Press notes from Ink of Memories — since {FOUNDED_YEAR}
          </div>
          <div className="hidden text-[11px] tracking-wide text-foreground/70 sm:block">
            Panchkula · Chandigarh · In-house production
          </div>
        </div>

        {/* Header Title — matches HeroSection / Atelier typography */}
        <div className="border-b border-border/20 pb-[22px] pt-[26px]">
          <p className="mb-4 text-sm text-foreground/70">
            Letterpress and foil stationery, since {FOUNDED_YEAR}
          </p>
          <h1 className="mb-[10px] max-w-[16ch] font-serif text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.04] tracking-tight">
            Notes from the <span className="italic text-gold-text">press.</span>
          </h1>
          <p className="max-w-[56ch] text-[15px] leading-[1.75] text-foreground/80 md:text-base">
            Paper stocks, foil stamping, letterpress and design notes — from
            wedding suites and shagun envelopes to visiting cards and brochures.
            Proofed on real paper in our Panchkula atelier.
          </p>
          <p className="mt-5 max-w-[46ch] border-t border-border/20 pt-4 text-sm leading-relaxed text-foreground/70">
            Trusted by over 50,000 clients, with more than 100 original designs
            in the collection.
          </p>
        </div>

        {/* Search & Categories — bottle-green / foil-gold system */}
        <div className="flex flex-col gap-[14px] border-b border-border/20 py-4 md:flex-row md:items-center md:gap-[32px]">
          <div className="flex max-w-[320px] items-center gap-2 border-b border-border px-[2px] py-[6px] md:min-w-[200px] md:flex-1 dark:border-border">
            <Search size={16} className="shrink-0 text-gold-text" />
            <input
              placeholder="Search press notes — try “foil”, “paper”, “wedding”…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-[2px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shrink-0 border-b-2 pb-[5px] font-sans text-[13px] whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "border-gold font-semibold text-foreground"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Feed — bone cards on sage paper, like CategoriesSection */}
        {displayJournals.length > 0 ? (
          <div className="-mt-[1px] grid grid-cols-1 gap-6 border border-border/20 bg-transparent py-6 sm:grid-cols-2 lg:grid-cols-6">
            {displayJournals.map((post, index) => {
              const variant =
                index === 0 && !isFiltered
                  ? "lead"
                  : index === 1 && !isFiltered
                    ? "second"
                    : "reg";
              return (
                <JournalCard
                  key={post._id}
                  post={post}
                  index={index}
                  variant={variant}
                />
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-[72px] text-center">
            <h3 className="font-sans text-[1.4rem] font-medium">
              No matching press notes found
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              Try “wedding”, “visiting card”, “foil” or “paper”.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
