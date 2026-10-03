"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArticleBlock } from "./articleContent";

interface TableOfContentsProps {
  blocks: ArticleBlock[];
}

/**
 * "In this note" outline with scroll-spy highlighting.
 *
 * Hidden entirely when the article has fewer than two headings — a TOC with
 * one entry is noise, so we render nothing rather than an empty card.
 */
export default function TableOfContents({ blocks }: TableOfContentsProps) {
  // Memoised so the scroll listener below isn't torn down and re-attached on
  // every render of the parent.
  const headings = useMemo(
    () =>
      blocks
        .filter((b): b is Extract<ArticleBlock, { kind: "h2" | "h3" }> =>
          b.kind === "h2" || b.kind === "h3",
        )
        .map((b) => ({ id: b.id, text: b.text, level: b.kind })),
    [blocks],
  );

  const headingKey = headings.map((h) => h.id).join("|");
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const offset = 140; // navbar + breathing room
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = heading.id;
        }
      }
      // At the very bottom of the page the last heading may never cross the
      // line — highlight it once the reader reaches the footer.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = headings[headings.length - 1].id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // `headingKey` is a stable primitive for the heading list, so the listener
    // only re-binds when the article itself changes.
  }, [headingKey, headings]);

  if (headings.length < 2) return null;

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      (parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
        10,
      ) || 65) -
      24;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-sm border border-border/15 bg-ivory p-5 shadow-[0_18px_36px_-28px_rgba(31,58,50,.5)]"
    >
      <p className="mb-3 text-[11px] text-muted-foreground ">
        In this note
      </p>
      <ul className="space-y-[2px] border-l border-border/15">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <button
                type="button"
                onClick={() => goTo(heading.id)}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block w-full border-l-2 py-[6px] text-left text-[13px] leading-snug transition-colors ${
                  heading.level === "h3" ? "pl-6 pr-1" : "pl-4 pr-1"
                } ${
                  isActive
                    ? "border-gold font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-gold/50 hover:text-foreground dark:hover:text-foreground"
                }`}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}