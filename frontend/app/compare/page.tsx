"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Scale, Trash2, X, ArrowLeft, Check } from "lucide-react";

import {
  useCompare,
  MAX_COMPARE_ITEMS,
  type CompareItem,
} from "@/store/CompareProvider";
import { SEOHelper } from "@/components/SEOHelper";
import { cn } from "@/lib/utils";

/** Money helper — keeps the ₹ formatting consistent with the product cards. */
const inr = (n?: number) =>
  typeof n === "number" && Number.isFinite(n)
    ? `₹${n.toLocaleString("en-IN")}`
    : "—";

/** Small corner control so each column is dismissible in place. */
function RemoveChip({ item }: { item: CompareItem }) {
  const { removeItem } = useCompare();

  return (
    <button
      type="button"
      onClick={() => removeItem(item._id)}
      aria-label={`Remove ${item.title} from comparison`}
      title="Remove"
      className="-mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-400 transition-colors hover:border-red-800 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-stone-700 dark:hover:border-red-600 dark:hover:text-red-600"
    >
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </button>
  );
}

function ColumnActions({ item }: { item: CompareItem }) {
  const { removeItem } = useCompare();

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/products/${item.slug || item._id}`}
        className="inline-flex items-center justify-center border border-stone-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:border-stone-100 dark:text-stone-100 dark:hover:bg-stone-100 dark:hover:text-stone-900 dark:focus-visible:ring-stone-100"
      >
        View
      </Link>
      <button
        type="button"
        onClick={() => removeItem(item._id)}
        className="inline-flex items-center justify-center gap-1.5 border border-stone-300 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:border-red-800 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-stone-700 dark:text-stone-400 dark:hover:border-red-600 dark:hover:text-red-600"
      >
        <Trash2 className="h-3 w-3" />
        Remove
      </button>
    </div>
  );
}

export default function ComparePage() {
  const { items, clearAll } = useCompare();

  /** Cheapest comparable price — flags the best-value column. */
  const bestPrice = useMemo(() => {
    const prices = items
      .map((i) => i.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    return prices.length ? Math.min(...prices) : null;
  }, [items]);

  return (
    <div className="min-h-screen bg-[#FCFBF9] pb-32 dark:bg-[#0f111a]">
      <SEOHelper
        title="Compare Printing Products"
        description="Compare printing products side by side — pricing, category and details — before you order from Samlason Printing Press."
        path="/compare"
        image="https://inkofmemories.com/inkofmemories.png"
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          {/* Editorial header — same system as PageHeader, kept inline so the
              page stays one self-contained client boundary. */}
          <div className="border-b border-stone-200 pb-6 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-red-800 dark:bg-red-600" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                Side by Side
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-stone-900 md:text-5xl dark:text-stone-100">
              Compare{" "}
              <em className="font-light text-red-800 dark:text-red-600">
                the Press
              </em>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-light leading-[1.8] text-stone-600 dark:text-stone-300">
              Put up to {MAX_COMPARE_ITEMS} pieces side by side and weigh them
              before you commit.
            </p>
          </div>

          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <Results
              items={items}
              bestPrice={bestPrice}
              onClear={clearAll}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════ */
function EmptyState() {
  return (
    <div className="mt-12 flex flex-col items-center border border-stone-200 py-24 text-center dark:border-stone-700">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
        <Scale
          aria-hidden="true"
          className="h-9 w-9 text-stone-400 dark:text-stone-500"
          strokeWidth={1.4}
        />
      </div>
      <p className="mt-7 font-serif text-2xl text-stone-900 dark:text-stone-100">
        Nothing to compare yet
      </p>
      <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-stone-500 dark:text-stone-400">
        Tap the scale icon on any piece in the catalogue and it will be lined up
        here for you.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 border border-red-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-900 transition-colors hover:bg-red-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-red-800 dark:text-red-400"
      >
        Browse the catalogue
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════
   RESULTS — the comparison grid
   ══════════════════════════════════════ */
function Results({
  items,
  bestPrice,
  onClear,
}: {
  items: CompareItem[];
  bestPrice: number | null;
  onClear: () => void;
}) {
  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p
          aria-live="polite"
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500"
        >
          {items.length} of {MAX_COMPARE_ITEMS} selected
        </p>

        <div className="flex items-center gap-4">
          {items.length < MAX_COMPARE_ITEMS && (
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-red-800 dark:text-stone-400 dark:hover:text-red-600"
            >
              <ArrowLeft className="h-3 w-3" />
              Add more
            </Link>
          )}
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-red-800 dark:text-stone-400 dark:hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </button>
        </div>
      </div>

      {/* Scrolls horizontally on narrow screens — a 4-column table would
          otherwise squash every column down to an unreadable width. */}
      <div className="mt-8 overflow-x-auto pb-4">
        <div
          className="grid min-w-[640px] gap-px bg-stone-200 dark:bg-stone-700"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => {
            // Only badge a winner when it's a unique lowest price, otherwise
            // every tied column would claim "Best price".
            const tied = items.filter((i) => i.price === bestPrice).length;
            const isBest =
              bestPrice !== null && item.price === bestPrice && tied === 1;

            return (
              <div
                key={item._id}
                className="flex flex-col gap-4 bg-[#FCFBF9] p-5 dark:bg-[#0f111a]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 45vw, 22vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-start justify-between gap-2">
                  {item.category ? (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                      {item.category}
                    </p>
                  ) : (
                    <span />
                  )}
                  <RemoveChip item={item} />
                </div>

                <h2 className="font-serif text-lg leading-snug text-stone-900 dark:text-stone-100">
                  {item.title}
                </h2>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className={cn(
                      "text-lg tabular-nums",
                      isBest
                        ? "font-bold text-red-800 dark:text-red-600"
                        : "font-medium text-stone-900 dark:text-stone-100",
                    )}
                  >
                    {inr(item.price)}
                  </span>
                  {item.originalPrice &&
                    item.originalPrice > (item.price ?? 0) && (
                      <span className="text-sm tabular-nums text-stone-300 line-through dark:text-stone-600">
                        {inr(item.originalPrice)}
                      </span>
                    )}
                </div>

                {isBest && (
                  <span className="inline-flex w-fit items-center gap-1 bg-stone-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white dark:bg-stone-100 dark:text-stone-900">
                    <Check aria-hidden="true" className="h-2.5 w-2.5" />
                    Best price
                  </span>
                )}

                <div className="mt-auto pt-2">
                  <ColumnActions item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-xs font-light leading-relaxed text-stone-500 dark:text-stone-400">
        Prices are shown at the standard per-piece rate. Final cost varies with
        quantity, paper and finish —{" "}
        <Link
          href="/contact"
          className="text-red-800 underline underline-offset-4 hover:text-red-600 dark:text-red-600"
        >
          ask our press
        </Link>{" "}
        for an exact quote.
      </p>
    </>
  );
}
