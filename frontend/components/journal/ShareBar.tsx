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
    "inline-flex items-center justify-center gap-2 rounded-full border border-border/25 bg-ivory px-4 py-2 text-[12px] font-medium tracking-wide text-foreground transition-all duration-200 hover:border-gold hover:bg-footer hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 dark:hover:border-gold dark:hover:bg-gold dark:hover:text-foreground";

  return (
    <div
      className={
        orientation === "column"
          ? "flex flex-col items-stretch gap-2"
          : "flex flex-wrap items-center gap-2"
      }
    >
      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground ">
        <Share2 size={13} className="text-gold-text" />
        Share
      </span>

      <button type="button" onClick={copyLink} className={base}>
        {copied ? (
          <Check size={14} className="text-gold-text" />
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