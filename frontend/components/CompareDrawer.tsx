"use client";

import { useCompare, MAX_COMPARE_ITEMS, type CompareItem } from "@/store/CompareProvider";
import { X, ArrowRight, Trash2, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════
   SINGLE PROPERTY THUMBNAIL
══════════════════════════════════════ */
function CompareThumb({
  item,
  onRemove,
}: {
  item: CompareItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="group relative flex items-center gap-1.5 rounded-lg bg-card pl-1.5 pr-2 py-1.5 transition-all duration-200 shrink-0"
      style={{
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 1px 4px hsl(var(--foreground) / 0.05)",
      }}
    >
      {/* thumbnail */}
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image || "/inkofmemories.png"}
          alt={item.title}
          fill
          className="object-cover"
          sizes="28px"
        />
      </div>

      {/* title */}
      <span className="max-w-[80px] sm:max-w-[120px] truncate text-[11px] font-medium text-foreground/80">
        {item.title}
      </span>

      {/* remove button */}
      <button
        type="button"
        onClick={() => onRemove(item._id)}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Remove ${item.title} from comparison`}
        title="Remove"
      >
        <X className="h-2.5 w-2.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPARE DRAWER
══════════════════════════════════════ */
export default function CompareDrawer() {
  const { items, count, removeItem, clearAll } = useCompare();

  const slotsLeft = Math.max(0, MAX_COMPARE_ITEMS - count);

  // No early `return null` — AnimatePresence needs the component to stay
  // mounted so it can play the exit slide when the last item is removed.
  return (
    <>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key="compare-drawer"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="mx-auto w-full max-w-4xl px-2 pb-1.5 sm:px-4 sm:pb-2">
              <div
                className="rounded-lg sm:rounded-[12px] bg-card/95 backdrop-blur-md px-2.5 py-2 sm:px-4 sm:py-2.5"
                style={{
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 -4px 28px hsl(var(--foreground) / 0.10)",
                }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {/* ── LEFT: label + thumbnails inline ── */}
                  <div className="flex flex-col gap-1.5 min-w-0 sm:flex-row sm:items-center sm:gap-3">
                    {/* label group */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: "hsl(var(--brand) / 0.10)" }}
                      >
                        <Scale
                          size={11}
                          style={{ color: "hsl(var(--brand))" }}
                          strokeWidth={2.4}
                        />
                      </div>
                      <span className="font-[Playfair_Display] text-[12px] font-semibold text-foreground leading-none">
                        Compare
                      </span>
                      <span
                        className="inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none"
                        style={{
                          background: "hsl(var(--brand) / 0.10)",
                          color: "hsl(var(--brand))",
                        }}
                      >
                        {count}/{MAX_COMPARE_ITEMS}
                      </span>
                    </div>

                    {/* thumbnails row */}
                    <div className="flex flex-nowrap items-center gap-1 overflow-x-auto scrollbar-none">
                      {items.map((item: CompareItem) => (
                        <CompareThumb
                          key={item._id}
                          item={item}
                          onRemove={removeItem}
                        />
                      ))}

                      {/* empty slot hints */}
                      {Array.from({ length: slotsLeft }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="hidden sm:flex items-center justify-center h-[30px] w-[30px] shrink-0 rounded-lg text-muted-foreground/60 text-[10px] font-medium"
                          style={{ border: "1.5px dashed hsl(var(--border))" }}
                        >
                          +
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── RIGHT: actions ── */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* clear all */}
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      style={{ border: "1px solid hsl(var(--border))" }}
                    >
                      <Trash2 size={10} />
                    </button>

                    {/* compare now */}
                    <Link
                      href="/compare"
                      className="inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-brand-hover active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      style={{
                        background: "hsl(var(--brand))",
                        boxShadow: "0 4px 16px hsl(var(--foreground) / 0.18)",
                      }}
                    >
                      Compare
                      <ArrowRight size={11} strokeWidth={2.4} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
