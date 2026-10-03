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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 dark:focus-visible:ring-red-600 dark:focus-visible:ring-offset-[#0f111a]",
        selected
          ? "scale-105 border-stone-900 bg-stone-900 text-white shadow-[0_0_12px_rgba(15,23,42,0.25)] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
          : "border-stone-300 bg-white/60 text-stone-500 hover:border-stone-900 hover:bg-white/80 hover:text-stone-900 dark:border-stone-600 dark:bg-stone-900/60 dark:text-stone-400 dark:hover:border-stone-100 dark:hover:text-stone-100",
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
