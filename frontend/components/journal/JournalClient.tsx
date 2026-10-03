"use client";

import React, { useState, useMemo } from "react";
import { useGetBlogsQuery } from "@/services/blogApi";
import { Search } from "lucide-react";
import JournalCard, { JournalPost } from "@/components/journal/JournalCard";

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
      <div className="min-h-screen bg-[#E4E9DD] font-sans text-[#1F3A32] dark:bg-[#16211D] dark:text-[#F7F4EE]">
        <div className="mx-auto max-w-[1220px] px-5 py-10 md:px-8">
          <div className="mb-[30px] h-[60px] w-[260px] animate-pulse bg-[#1F3A32]/10 dark:bg-white/10" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-sm bg-[#F7F4EE] p-4 sm:col-span-1 lg:col-span-2 dark:bg-[#1C2B26]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError && allJournals.length === 0) {
    return (
      <div className="min-h-screen bg-[#E4E9DD] font-sans text-[#1F3A32] dark:bg-[#16211D] dark:text-[#F7F4EE]">
        <div className="px-5 py-[72px] text-center">
          <h3 className="font-serif text-[1.4rem] font-medium">Press paused</h3>
          <p className="mt-2 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
            Unable to load press notes right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4E9DD] pt-28 font-sans text-[#1F3A32] dark:bg-[#16211D] dark:text-[#F7F4EE]">
      <div className="mx-auto max-w-full px-5 md:px-8">
        {/* Masthead — matches homepage eyebrow voice */}
        <div className="flex items-end justify-between gap-3 border-b border-[#1F3A32]/20 pb-[14px] pt-[18px] dark:border-[#E4E9DD]/20">
          <div className="text-[11px] tracking-wide text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
            <b className="font-semibold text-[#1F3A32] dark:text-[#F7F4EE]">
              Ink of Memories
            </b>{" "}
            · Press notes from Samlason Printing Press — since 1984
          </div>
          <div className="hidden text-[11px] tracking-wide text-[#1F3A32]/70 sm:block dark:text-[#E4E9DD]/70">
            Panchkula · Chandigarh · In-house production
          </div>
        </div>

        {/* Header Title — matches HeroSection / Atelier typography */}
        <div className="border-b border-[#1F3A32]/20 pb-[22px] pt-[26px] dark:border-[#E4E9DD]/20">
          <p className="mb-4 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
            Letterpress and foil stationery, since 1984
          </p>
          <h1 className="mb-[10px] max-w-[16ch] font-serif text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.04] tracking-tight">
            Notes from the <span className="italic text-[#8A6A2F]">press.</span>
          </h1>
          <p className="max-w-[56ch] text-[15px] leading-[1.75] text-[#1F3A32]/80 md:text-base dark:text-[#E4E9DD]/80">
            Paper stocks, foil stamping, letterpress and design notes — from
            wedding suites and shagun envelopes to visiting cards and
            brochures. Proofed on real paper in our Panchkula atelier.
          </p>
          <p className="mt-5 max-w-[46ch] border-t border-[#1F3A32]/20 pt-4 text-sm leading-relaxed text-[#1F3A32]/70 dark:border-[#E4E9DD]/20 dark:text-[#E4E9DD]/70">
            Trusted by over 50,000 clients, with more than 100 original
            designs in the collection.
          </p>
        </div>

        {/* Search & Categories — bottle-green / foil-gold system */}
        <div className="flex flex-col gap-[14px] border-b border-[#1F3A32]/20 py-4 md:flex-row md:items-center md:gap-[32px] dark:border-[#E4E9DD]/20">
          <div className="flex max-w-[320px] items-center gap-2 border-b border-[#1F3A32] px-[2px] py-[6px] md:min-w-[200px] md:flex-1 dark:border-[#F7F4EE]">
            <Search size={16} className="shrink-0 text-[#B08D4A]" />
            <input
              placeholder="Search press notes — try “foil”, “paper”, “wedding”…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full bg-transparent font-sans text-sm text-[#1F3A32] outline-none placeholder:text-[#1F3A32]/50 dark:text-[#F7F4EE] dark:placeholder:text-[#E4E9DD]/50"
            />
          </div>
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-[2px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shrink-0 border-b-2 pb-[5px] font-sans text-[13px] whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "border-[#B08D4A] font-semibold text-[#1F3A32] dark:text-[#F7F4EE]"
                    : "border-transparent text-[#1F3A32]/70 hover:text-[#1F3A32] dark:text-[#E4E9DD]/70 dark:hover:text-white"
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
          <div className="-mt-[1px] grid grid-cols-1 gap-6 border border-[#1F3A32]/20 bg-transparent py-6 sm:grid-cols-2 lg:grid-cols-6 dark:border-[#E4E9DD]/20">
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
            <h3 className="font-serif text-[1.4rem] font-medium">
              No matching press notes found
            </h3>
            <p className="mt-2 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
              Try “wedding”, “visiting card”, “foil” or “paper”.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
