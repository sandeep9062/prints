import { categories as allCategories } from "./products";

/**
 * ------------------------------------------------------------
 * The categories a product can actually be saved with.
 *
 * Derived from `categories` in data/products.ts — the same list
 * the storefront and dashboard filters already read — instead of
 * being restated here, so the three can never drift apart.
 *
 * "All Products" is dropped: it is a filter sentinel ("show me
 * everything"), not a value `Product.category` should ever hold.
 * ------------------------------------------------------------
 */
export const PRODUCT_CATEGORIES: string[] = allCategories.filter(
  (category) => category !== "All Products",
);

export interface ProductOption {
  /** Stored on the product — `Product.options.*` are `[String]` fields. */
  name: string;
  /** Swatch fill. Omitted for options with no meaningful colour (paper types). */
  hex?: string;
  /**
   * Border colour for swatches too light to see against the card
   * surface (whites, creams, pastels). Omitted for dark swatches.
   */
  border?: string;
}

/**
 * ------------------------------------------------------------
 * The palette offered by the product form's color picker.
 *
 * `Product.options.colors` is a free-form `[String]`, so this list
 * is a starting point rather than a constraint: the picker still
 * accepts custom names (Pantone references, bespoke shades) and
 * renders anything already on a product as its own swatch.
 * ------------------------------------------------------------
 */
export const COLOR_OPTIONS: ProductOption[] = [
  { name: "White", hex: "#FFFFFF", border: "#D4D4D8" },
  { name: "Ivory", hex: "#FFFFF0", border: "#D4D4D8" },
  { name: "Cream", hex: "#FDF6E3", border: "#D4D4D8" },
  { name: "Beige", hex: "#E8DCC8", border: "#D4D4D8" },
  { name: "Champagne", hex: "#E7D3B1", border: "#D4D4D8" },
  { name: "Black", hex: "#111111" },
  { name: "Charcoal", hex: "#3F3F46" },
  { name: "Slate Gray", hex: "#9CA3AF" },
  { name: "Silver", hex: "#C0C0C0", border: "#D4D4D8" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Copper", hex: "#B87333" },
  { name: "Bronze", hex: "#8C7853" },
  { name: "Brown", hex: "#6B4F3A" },
  { name: "Red", hex: "#DC2626" },
  { name: "Maroon", hex: "#7F1D1D" },
  { name: "Coral", hex: "#FB7185" },
  { name: "Peach", hex: "#FDBA9C", border: "#D4D4D8" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blush Pink", hex: "#FBCFE8", border: "#D4D4D8" },
  { name: "Orange", hex: "#F97316" },
  { name: "Mustard", hex: "#D4A017" },
  { name: "Yellow", hex: "#FACC15", border: "#D4D4D8" },
  { name: "Mint", hex: "#A7F3D0", border: "#D4D4D8" },
  { name: "Green", hex: "#16A34A" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Olive", hex: "#6B7A3A" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Sky Blue", hex: "#7DD3FC", border: "#D4D4D8" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Navy Blue", hex: "#1E3A8A" },
  { name: "Lavender", hex: "#C4B5FD", border: "#D4D4D8" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Multicolour", hex: "#A855F7" },
];

/**
 * ------------------------------------------------------------
 * The stock offered for `Product.options.paperTypes`.
 *
 * Text-only (no swatch) — picked with the same chip UI as the colors
 * so both fields behave identically and custom entries are still
 * allowed, since the schema stores both as `[String]`.
 * ------------------------------------------------------------
 */
export const PAPER_TYPE_OPTIONS: ProductOption[] = [
  { name: "Matte" },
  { name: "Glossy" },
  { name: "Satin" },
  { name: "Lustre" },
  { name: "Pearl" },
  { name: "Textured" },
  { name: "Linen" },
  { name: "Suede" },
  { name: "Velvet Finish" },
  { name: "Silk Finish" },
  { name: "Metallic Gold" },
  { name: "Metallic Silver" },
  { name: "Rose Gold Foil" },
  { name: "Gold Foil" },
  { name: "Silver Foil" },
  { name: "Kraft" },
  { name: "Recycled Card" },
  { name: "Cardstock" },
  { name: "Art Card" },
  { name: "Cover Paper" },
  { name: "Bond" },
  { name: "Maplitho" },
  { name: "Vellum" },
  { name: "Photo Paper" },
  { name: "Fine Art Matte" },
  { name: "Canvas" },
  { name: "Acrylic" },
  { name: "Transparent" },
];

/**
 * Case-insensitive lookup within a given option list. Returns
 * `undefined` for names we never listed, which callers treat as
 * "no entry / no swatch known".
 */
export function findOption(
  options: ProductOption[],
  name: string,
): ProductOption | undefined {
  const needle = name.trim().toLowerCase();
  return options.find((option) => option.name.toLowerCase() === needle);
}

/**
 * An option list plus the values currently saved on the product that
 * aren't in it.
 *
 * Products created before these pickers existed carry free-text values
 * ("Pink Bloom", "Textured Ivory"). Merging them in keeps those values
 * visible and selected, so editing an older product can't silently drop
 * options it never re-picked.
 *
 * `swatch` marks the list as visual: custom entries then get a neutral
 * swatch instead of rendering as a bare chip.
 */
export function withCustomOptions(
  base: ProductOption[],
  selected: string[],
  { swatch = false }: { swatch?: boolean } = {},
): ProductOption[] {
  const extras: ProductOption[] = selected
    .filter((name) => !findOption(base, name))
    .map((name) =>
      swatch
        ? { name, hex: "#A1A1AA", border: "#D4D4D8" }
        : { name },
    );

  return [...base, ...extras];
}