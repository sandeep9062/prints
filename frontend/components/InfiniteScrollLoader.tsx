"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollLoaderProps {
  onIntersect: () => void;
  loading: boolean;
  hasMore: boolean;
}

/**
 * Renders a thin sentinel <div> at the bottom of a list.
 * When it becomes visible (via Intersection Observer) it fires `onIntersect`
 * to load the next page.
 *
 * FIX: this used to also run a `window.scroll` listener as a "safety net"
 * that read `document.documentElement.scrollHeight` on every scroll event.
 * Reading scrollHeight forces the browser to synchronously flush layout
 * before it can return a value ("forced synchronous layout"/"layout
 * thrashing"). Doing that on every scroll tick — potentially dozens of
 * times a second during a fast scroll or fling — blocked the main thread
 * badly enough that the compositor had nothing ready to paint, which is
 * what showed up as blank frames while scrolling fast.
 *
 * The IntersectionObserver below does the same job (triggering load-more)
 * without ever touching layout, and the large 1500px rootMargin already
 * makes it fire well before the sentinel is actually on-screen — so the
 * scroll listener wasn't buying any real reliability, just cost.
 */
export default function InfiniteScrollLoader({
  onIntersect,
  loading,
  hasMore,
}: InfiniteScrollLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onIntersect();
        }
      },
      {
        // Start loading 1500px before the sentinel enters the viewport.
        // Larger value = more eager loading, fewer "stuck" moments —
        // this alone is what keeps loading reliable, no scroll listener
        // needed on top of it.
        rootMargin: "1500px 0px 1500px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, loading, hasMore]);

  if (!hasMore) return null;

  return (
    <div
      ref={sentinelRef}
      className="w-full flex justify-center py-6 animate-in"
    >
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading more ...</span>
        </div>
      )}
    </div>
  );
}
