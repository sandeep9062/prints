"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  findOption,
  withCustomOptions,
  type ProductOption,
} from "@/data/productOptions";

interface OptionPickerProps {
  /** The curated option list (COLOR_OPTIONS, PAPER_TYPE_OPTIONS, …). */
  options: ProductOption[];
  /** Selected names, in the order they were picked. */
  value: string[];
  onChange: (values: string[]) => void;
  label: string;
  id?: string;
  /** Draws a colour dot for each option; used by the palette. */
  showSwatch?: boolean;
  /** Placeholder for the "add your own" input. */
  customPlaceholder?: string;
}

/**
 * Multi-select chip picker for the `Product.options.*` `[String]` fields
 * (colors, paper types).
 *
 * Replaces the old "type a comma separated list" inputs: picking from a
 * fixed list keeps the stored values consistent — no "Matte", "matte",
 * "Matt " drift — which matters because the storefront filters and
 * renders these values directly.
 *
 * The list is a convenience, not a constraint. The schema keeps these
 * fields free-form, so a custom name can always be added (Pantone
 * references, bespoke finishes) and values already saved on a product
 * show up as their own chip instead of being dropped on the next save.
 */
export default function OptionPicker({
  options,
  value,
  onChange,
  label,
  id,
  showSwatch = false,
  customPlaceholder = "Add a custom option",
}: OptionPickerProps) {
  const [customValue, setCustomValue] = useState("");

  // Curated list first, then any saved value we have no entry for.
  const visibleOptions = withCustomOptions(options, value, {
    swatch: showSwatch,
  });

  const toggle = (name: string) => {
    onChange(
      value.includes(name)
        ? value.filter((entry) => entry !== name)
        : [...value, name],
    );
  };

  const addCustom = () => {
    const name = customValue.trim();
    if (!name) return;
    // Case-insensitive so "matte" doesn't sit next to "Matte" as two chips.
    if (!value.some((entry) => entry.toLowerCase() === name.toLowerCase())) {
      onChange([...value, name]);
    }
    setCustomValue("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-custom`}>{label}</Label>

      <div id={id} role="group" aria-label={label} className="flex flex-wrap gap-2">
        {visibleOptions.map((option) => {
          const selected = value.includes(option.name);
          const isCustom = !findOption(options, option.name);

          return (
            <button
              key={option.name}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.name)}
              title={isCustom ? `${option.name} (custom)` : option.name}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-brand bg-brand-soft text-foreground"
                  : "border-border bg-background hover:border-brand/50",
              )}
            >
              {showSwatch && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rounded-full border shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
                  style={{
                    backgroundColor: option.hex,
                    borderColor: option.border ?? "transparent",
                  }}
                />
              )}
              {option.name}
              {selected && <Check className="h-3 w-3 text-brand" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Input
          id={`${id}-custom`}
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // Otherwise the surrounding form submits on Enter.
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder={customPlaceholder}
          className="h-9"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCustom}
          disabled={!customValue.trim()}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Pick one or more — {options.length} options available. Selected:{" "}
        {value.length ? value.join(", ") : "none yet"}
      </p>
    </div>
  );
}