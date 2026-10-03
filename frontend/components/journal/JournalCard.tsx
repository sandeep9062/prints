import React from "react";
import Image from "next/image";

export interface JournalPost {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  publishedAt?: string;
  coverImage?: string;
}

interface JournalCardProps {
  post: JournalPost;
  index: number;
  variant: "lead" | "second" | "reg";
}

export default function JournalCard({
  post,
  index,
  variant,
}: JournalCardProps) {
  const isLead = variant === "lead";
  const isSecond = variant === "second";

  const formattedIndex = String(index + 1).padStart(2, "0");

  if (isLead || isSecond) {
    return (
      <a
        href={`/blog/${post.slug}`}
        className={`group relative flex flex-col justify-end overflow-hidden rounded-sm bg-[#1F3A32] text-[#F7F4EE] shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] ${
          isLead
            ? "min-h-[320px] p-5 sm:col-span-2 lg:col-span-4 lg:min-h-[480px] lg:p-[28px]"
            : "min-h-[260px] p-5 sm:col-span-2 lg:col-span-2 lg:min-h-[480px] lg:p-[24px]"
        }`}
      >
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="z-0 object-cover transition-transform duration-600 ease-in-out group-hover:scale-[1.035]"
          />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(31,58,50,0.05)] via-transparent to-[rgba(31,58,50,0.88)]" />
        <span className="absolute left-[18px] top-[16px] z-[2] text-[11px] tracking-wide text-white/75">
          #{formattedIndex}
        </span>
        {/* Double gold rule — classic stationery border */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-[2] border border-[#B08D4A]/70"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 z-[2] border border-[#B08D4A]/40"
        />
        <div className="relative z-[3]">
          {post.category && (
            <span className="mb-2 inline-block text-[11px] tracking-wide underline decoration-[#D2AE62] underline-offset-[3px]">
              {post.category}
            </span>
          )}
          <h2
            className={`mb-2 font-serif font-medium leading-[1.14] ${
              isLead ? "text-[clamp(1.5rem,3vw,2rem)]" : "text-[1.3rem]"
            }`}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mb-[10px] text-[13px] leading-[1.5] text-white/80 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-[14px] text-[10.5px] tracking-wide text-white/75">
            {post.publishedAt && <span>{post.publishedAt}</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-sm bg-[#F7F4EE] p-3 text-[#1F3A32] shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 sm:col-span-1 lg:col-span-2 dark:bg-[#1C2B26] dark:text-[#F7F4EE]"
    >
      <span className="px-2 pt-2 text-[11px] tracking-wide text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
        #{formattedIndex}
      </span>
      {post.coverImage && (
        <div className="m-2 mb-[14px] aspect-[16/10] w-[calc(100%-16px)] overflow-hidden bg-[#D5DCCB] dark:bg-[#22332D]">
          <Image
            src={post.coverImage}
            alt=""
            width={400}
            height={250}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="px-2 pb-3">
        {post.category && (
          <span className="mb-2 inline-block text-[11px] tracking-wide text-[#8A6A2F] underline decoration-[#B08D4A] underline-offset-[3px] dark:text-[#D2AE62]">
            {post.category}
          </span>
        )}
        <h3 className="mb-2 font-serif text-[1.1rem] font-medium leading-[1.14] underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-[#B08D4A]">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-[10px] text-[13px] leading-[1.5] text-[#1F3A32]/75 line-clamp-3 dark:text-[#E4E9DD]/75">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-[14px] pt-2 text-[10.5px] tracking-wide text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
          {post.publishedAt && <span>{post.publishedAt}</span>}
          {post.readTime && <span>{post.readTime}</span>}
        </div>
      </div>
    </a>
  );
}
