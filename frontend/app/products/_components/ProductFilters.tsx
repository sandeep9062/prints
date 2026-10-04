"use client";

import { useId, useState } from "react";
import { RotateCcw } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn, formatINR } from "@/lib/utils";
import { COLOR_FAMILIES } from "@/lib/productColors";

const numberField =
  "w-full rounded-none border border-border bg-transparent px-3 py-2.5 text-sm tabular-nums text-foreground outline-none transition-colors focus:border-brand/60 focus:ring-1 focus:ring-brand dark:border-border dark:text-foreground/70";

const sectionLabel =
  "text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground";

export interface PriceFilterProps {
  /** Lowest price across the loaded catalogue. */
  min: number;
  /** Highest price across the loaded catalogue. */
  max: number;
  /** Currently applied bounds; null = unbounded on that side. */
  selectedMin: number | null;
  selectedMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

/**
 * Two-thumb price range.
 *
 * The thumb pair is driven by a local `range` state and only committed to the
 * parent on `onValueCommit` — firing on every pixel of a drag would push a
 * history entry per step and make the back button useless. The two number
 * fields let a shopper type an exact figure (the slider can only reach values
 * on `step`), and they clamp on commit so an inverted or out-of-catalogue
 * entry ("min 900, max 200") resolves instead of silently returning nothing.
 */
export function PriceFilter({
  min,
  max,
  selectedMin,
  selectedMax,
  onChange,
}: PriceFilterProps) {
  const fieldId = useId();

  // A catalogue where everything costs the same has min === max; Radix needs a
  // non-empty interval or both thumbs collapse onto one value and the drag
  // breaks. Widen it by a rupee so the range stays valid.
  const low = min;
  const high = Math.max(max, min + 1);

  const effectiveMin = selectedMin ?? low;
  const effectiveMax = selectedMax ?? high;

  const [range, setRange] = useState<[number, number]>([effectiveMin, effectiveMax]);

  // Fold URL-driven changes back in during render (React's "adjust state when a
  // prop changes" pattern, the same one the search box uses) so back/forward
  // navigation and the QuickLinks deep links move the thumbs. Doing it here
  // rather than in an effect avoids a wasted second render pass — React
  // discards this render's output and immediately re-renders with the new
  // state, so nothing flashes at the stale position.
  const [syncedMin, setSyncedMin] = useState(effectiveMin);
  const [syncedMax, setSyncedMax] = useState(effectiveMax);
  if (effectiveMin !== syncedMin || effectiveMax !== syncedMax) {
    setSyncedMin(effectiveMin);
    setSyncedMax(effectiveMax);
    setRange([effectiveMin, effectiveMax]);
  }

  const commit = (nextMin: number, nextMax: number) => {
    const lo = Math.min(Math.max(nextMin, low), high);
    const hi = Math.max(Math.min(nextMax, high), low);
    onChange(lo === low ? null : lo, hi === high ? null : hi);
  };

  const isDirty = selectedMin !== null || selectedMax !== null;

  const setMin = (raw: string) => {
    const parsed = Number(raw);
    setRange([Number.isFinite(parsed) ? Math.min(parsed, range[1]) : low, range[1]]);
  };

  const setMax = (raw: string) => {
    const parsed = Number(raw);
    setRange([range[0], Number.isFinite(parsed) ? Math.max(parsed, range[0]) : high]);
  };

  return (
    <fieldset>
      <legend className={cn(sectionLabel, "mb-4")}>Price</legend>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${fieldId}-min`} className="sr-only">
            Minimum price
          </label>
          <input
            id={`${fieldId}-min`}
            type="number"
            inputMode="numeric"
            min={low}
            max={high}
            value={range[0]}
            onChange={(e) => setMin(e.target.value)}
            onBlur={() => commit(range[0], range[1])}
            onKeyDown={(e) => e.key === "Enter" && commit(range[0], range[1])}
            className={numberField}
          />
        </div>
        <span aria-hidden="true" className="text-muted-foreground">
          —
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor={`${fieldId}-max`} className="sr-only">
            Maximum price
          </label>
          <input
            id={`${fieldId}-max`}
            type="number"
            inputMode="numeric"
            min={low}
            max={high}
            value={range[1]}
            onChange={(e) => setMax(e.target.value)}
            onBlur={() => commit(range[0], range[1])}
            onKeyDown={(e) => e.key === "Enter" && commit(range[0], range[1])}
            className={numberField}
          />
        </div>
      </div>

      <Slider
        value={range}
        min={low}
        max={high}
        step={1}
        minStepsBetweenThumbs={0}
        onValueChange={(value) => setRange([value[0], value[1]])}
        onValueCommit={(value) => commit(value[0], value[1])}
        aria-label="Price range"
        className="mt-6"
      />

      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold tabular-nums text-muted-foreground dark:text-muted-foreground">
        <span>{formatINR(low)}</span>
        <button
          type="button"
          onClick={() => {
            setRange([low, high]);
            onChange(null, null);
          }}
          disabled={!isDirty}
          className="inline-flex items-center gap-1 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw aria-hidden="true" className="h-3 w-3" />
          Reset
        </button>
        <span>{formatINR(high)}</span>
      </div>
    </fieldset>
  );
}

export interface ColorFilterProps {
  /** Selected `color` params. */
  selected: string[];
  /** How many products sit in each family, used to hide empty options. */
  counts: Record<string, number>;
  onToggle: (slug: string) => void;
  onClear: () => void;
}

/**
 * Multi-select colour swatches. Only families present in the catalogue render,
 * so the panel never offers a colour that returns nothing — with one
 * exception: a colour already in the URL stays listed even if its count is 0,
 * so a stale QuickLinks link still shows what it asked for rather than
 * silently dropping the selection.
 */
export function ColorFilter({
  selected,
  counts,
  onToggle,
  onClear,
}: ColorFilterProps) {
  const available = COLOR_FAMILIES.filter(
    (family) => (counts[family.slug] ?? 0) > 0 || selected.includes(family.slug),
  );

  if (available.length === 0) return null;

  return (
    <fieldset>
      {/* <legend> must be the fieldset's first child to stay the accessible
          name, so the Clear button is a sibling rather than a nested sibling
          inside the legend. */}
      <legend className={sectionLabel}>Colour</legend>

      {selected.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="-mt-4 mb-4 ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-muted-foreground"
        >
          <RotateCcw aria-hidden="true" className="h-3 w-3" />
          Clear
        </button>
      )}

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {available.map((family) => {
          const count = counts[family.slug] ?? 0;
          const checked = selected.includes(family.slug);

          return (
            <li key={family.slug}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 transition-colors duration-300",
                  "focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 dark:focus-within:ring-offset-background",
                  checked
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-brand/50 dark:border-border",
                  count === 0 && "opacity-50",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggle(family.slug)}
                  aria-label={family.label}
                  className="rounded-none"
                />
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rounded-full ring-1 ring-foreground/20"
                  style={{ backgroundColor: family.swatch }}
                />
                <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {family.label}
                </span>
                <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground dark:text-muted-foreground">
                  {count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
