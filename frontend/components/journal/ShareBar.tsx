"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Link2, Share2 } from "lucide-react";

interface ShareBarProps {
  title: string;
  url: string;
  /** Renders the buttons stacked vertically (used in the sticky side rail). */
  orientation?: "row" | "column";
}

export default function ShareBar({
  title,
  url,
  orientation = "row",
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  // Only usable in the browser; fall back to the canonical URL during SSR.
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link — please copy it manually");
    }
  };

  const nativeShare = async () => {
    if (!("share" in navigator)) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, url: shareUrl });
    } catch {
      /* user dismissed the sheet — nothing to report */
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border border-[#1F3A32]/25 bg-[#F7F4EE] px-4 py-2 text-[12px] font-medium tracking-wide text-[#1F3A32] transition-all duration-200 hover:border-[#B08D4A] hover:bg-[#1F3A32] hover:text-[#F7F4EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:border-[#E4E9DD]/25 dark:bg-[#1C2B26] dark:text-[#F7F4EE] dark:hover:border-[#D2AE62] dark:hover:bg-[#D2AE62] dark:hover:text-[#16211D]";

  return (
    <div
      className={
        orientation === "column"
          ? "flex flex-col items-stretch gap-2"
          : "flex flex-wrap items-center gap-2"
      }
    >
      <span className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-[#1F3A32]/60 uppercase dark:text-[#E4E9DD]/60">
        <Share2 size={13} className="text-[#B08D4A]" />
        Share
      </span>

      <button type="button" onClick={copyLink} className={base}>
        {copied ? (
          <Check size={14} className="text-[#B08D4A]" />
        ) : (
          <Link2 size={14} />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>

      <button type="button" onClick={nativeShare} className={base}>
        <Share2 size={14} />
        Share
      </button>
    </div>
  );
}