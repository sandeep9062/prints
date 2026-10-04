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
import { cn, formatINR } from "@/lib/utils";

/** Money helper — keeps the ₹ formatting consistent with the product cards. */
const inr = (n?: number) =>
  typeof n === "number" && Number.isFinite(n) ? formatINR(n) : "—";

/** Small corner control so each column is dismissible in place. */
function RemoveChip({ item }: { item: CompareItem }) {
  const { removeItem } = useCompare();

  return (
    <button
      type="button"
      onClick={() => removeItem(item._id)}
      aria-label={`Remove ${item.title} from comparison`}
      title="Remove"
      className="-mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-border dark:hover:border-brand dark:hover:text-brand"
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
        className="inline-flex items-center justify-center border border-foreground px-4 py-2.5 text-[10px] font-bold text-foreground transition-colors hover:bg-footer hover:text-footer-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-border dark:text-muted-foreground/70 dark:hover:bg-muted dark:hover:text-foreground dark:focus-visible:ring-brand"
      >
        View
      </Link>
      <button
        type="button"
        onClick={() => removeItem(item._id)}
        className="inline-flex items-center justify-center gap-1.5 border border-border px-4 py-2.5 text-[10px] font-bold text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-border dark:text-muted-foreground dark:hover:border-brand dark:hover:text-brand"
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
    <div className="min-h-screen bg-background pb-32">
      <SEOHelper
        title="Compare Printing Products"
        description="Compare printing products side by side — pricing, category and details — before you order from Ink of Memories."
        path="/compare"
        image="https://inkofmemories.com/inkofmemories.png"
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          {/* Editorial header — same system as PageHeader, kept inline so the
              page stays one self-contained client boundary. */}
          <div className="border-b border-border pb-6 dark:border-border">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              <span className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground">
                Side by Side
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl dark:text-muted-foreground/70">
              Compare{" "}
              <em className="font-medium text-primary">
                the Press
              </em>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-normal leading-[1.8] text-muted-foreground dark:text-muted-foreground/70">
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
    <div className="mt-12 flex flex-col items-center border border-border py-24 text-center dark:border-border">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted dark:bg-card">
        <Scale
          aria-hidden="true"
          className="h-9 w-9 text-muted-foreground dark:text-muted-foreground"
          strokeWidth={1.4}
        />
      </div>
      <p className="mt-7 font-sans text-2xl text-foreground dark:text-muted-foreground/70">
        Nothing to compare yet
      </p>
      <p className="mt-3 max-w-sm text-sm font-normal leading-relaxed text-muted-foreground dark:text-muted-foreground">
        Tap the scale icon on any piece in the catalogue and it will be lined up
        here for you.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 border border-brand/50 px-8 py-4 text-[11px] font-semibold text-brand transition-colors hover:bg-brand-hover hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-brand/50 dark:text-brand"
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
          className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground"
        >
          {items.length} of {MAX_COMPARE_ITEMS} selected
        </p>

        <div className="flex items-center gap-4">
          {items.length < MAX_COMPARE_ITEMS && (
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-brand dark:text-muted-foreground dark:hover:text-brand"
            >
              <ArrowLeft className="h-3 w-3" />
              Add more
            </Link>
          )}
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-brand dark:text-muted-foreground dark:hover:text-brand"
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
          className="grid min-w-[640px] gap-px bg-muted dark:bg-card"
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
                className="flex flex-col gap-4 bg-card p-5"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted dark:bg-card">
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
                    <p className="text-[10px] font-bold text-muted-foreground dark:text-muted-foreground">
                      {item.category}
                    </p>
                  ) : (
                    <span />
                  )}
                  <RemoveChip item={item} />
                </div>

                <h2 className="font-sans text-lg leading-snug text-foreground dark:text-muted-foreground/70">
                  {item.title}
                </h2>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className={cn(
                      "text-lg tabular-nums",
                      isBest
                        ? "font-bold text-destructive dark:text-destructive"
                        : "font-medium text-foreground dark:text-muted-foreground/70",
                    )}
                  >
                    {inr(item.price)}
                  </span>
                  {item.originalPrice &&
                    item.originalPrice > (item.price ?? 0) && (
                      <span className="text-sm tabular-nums text-muted-foreground/70 line-through dark:text-muted-foreground">
                        {inr(item.originalPrice)}
                      </span>
                    )}
                </div>

                {isBest && (
                  <span className="inline-flex w-fit items-center gap-1 bg-footer px-2.5 py-1 text-[9px] font-bold text-footer-foreground dark:bg-muted dark:text-foreground">
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

      <p className="mt-6 max-w-2xl text-xs font-normal leading-relaxed text-muted-foreground dark:text-muted-foreground">
        Prices are shown at the standard per-piece rate. Final cost varies with
        quantity, paper and finish —{" "}
        <Link
          href="/contact"
          className="text-brand underline underline-offset-4 hover:text-primary"
        >
          ask our press
        </Link>{" "}
        for an exact quote.
      </p>
    </>
  );
}
