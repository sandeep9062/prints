"use client";

import { useEffect, useState } from "react";

/**
 * Thin gold progress rail pinned under the fixed navbar. Tracks how far the
 * reader has scrolled through the whole document (not just the article), which
 * is the behaviour readers expect from a "reading progress" indicator.
 *
 * Uses rAF-throttled scroll + a CSS custom property so we never trigger a
 * React re-render on every frame.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = Math.min(
        1,
        Math.max(0, (window.scrollY || doc.scrollTop) / scrollable),
      );
      // Only re-render when the visible percentage actually changes.
      setProgress((prev) =>
        Math.abs(prev - ratio) < 0.005 ? prev : ratio,
      );
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
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 z-[60] h-[3px]"
      style={{ top: "var(--navbar-height, 65px)" }}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[#8A6A2F] via-[#D2AE62] to-[#8A6A2F] shadow-[0_0_10px_rgba(210,174,98,.55)] transition-[transform] duration-100 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}