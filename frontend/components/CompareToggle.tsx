"use client";

import { Scale, Check } from "lucide-react";
import { toast } from "sonner";

import {
  useCompare,
  MAX_COMPARE_ITEMS,
  type CompareItem,
} from "@/store/CompareProvider";
import { cn } from "@/lib/utils";

/**
 * Circular compare toggle for product cards.
 *
 * Mirrors the shared <Heart> wishlist control — same glassy circular shell, same
 * top-right overlay slot — so the two read as one pair of card affordances.
 * Selected state swaps the Scale glyph for a Check so the toggle reads without
 * relying on colour alone.
 */
export default function CompareToggle({
  item,
  className,
}: {
  item: CompareItem;
  className?: string;
}) {
  const { toggleItem, isSelected } = useCompare();

  const selected = isSelected(item._id);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Cards nest the whole tile in a Link in some layouts.
    e.preventDefault();
    e.stopPropagation();

    const result = toggleItem(item);

    if (result === "full") {
      toast.error(
        `You can compare up to ${MAX_COMPARE_ITEMS} products — remove one to add another.`,
      );
      return;
    }

    toast.success(
      result === "added"
        ? `${item.title} added to compare`
        : `${item.title} removed from compare`,
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={
        selected
          ? `Remove ${item.title} from compare`
          : `Add ${item.title} to compare`
      }
      title={selected ? "Remove from compare" : "Add to compare"}
      className={cn(
        "group/compare inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-brand dark:focus-visible:ring-offset-footer",
        selected
          ? "scale-105 border-brand bg-footer text-footer-foreground shadow-[0_0_12px_rgba(15,23,42,0.25)] dark:border-border dark:bg-muted dark:text-foreground"
          : "border-border bg-card/60 text-muted-foreground hover:border-brand hover:bg-card/80 hover:text-foreground dark:border-brand dark:bg-card/60 dark:text-muted-foreground dark:hover:border-border dark:hover:text-foreground",
        className,
      )}
    >
      {selected ? (
        <Check
          aria-hidden="true"
          size={18}
          strokeWidth={2.6}
          className="transition-transform duration-300 group-hover/compare:scale-110"
        />
      ) : (
        <Scale
          aria-hidden="true"
          size={18}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover/compare:scale-110"
        />
      )}
    </button>
  );
}
