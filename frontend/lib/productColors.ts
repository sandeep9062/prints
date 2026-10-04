/**
 * Colour taxonomy for the storefront filters.
 *
 * Products store colours as free text (`"Red with Gold"`, `"24K Gold Foil"`,
 * `"Burgundy Wax"`, …), so an exact-string comparison against a filter value
 * would almost never match. Instead every product colour is mapped onto a
 * small set of colour FAMILIES, and the filter works on families. A product
 * can belong to several families at once — `"White with Gold"` is both white
 * and gold — so `productColorFamilies` returns a set, and the filter keeps a
 * product when the selection intersects that set.
 *
 * Slugs here are the `color` query param on /products, which is what
 * components/QuickLinks.tsx links to. Keep the two in step: renaming a slug
 * here without renaming it there silently breaks the homepage colour links.
 * Swatches reuse the same hexes QuickLinks renders so the dot a shopper taps
 * on the home page looks identical here.
 */

export interface ColorFamily {
  /** URL token, e.g. /products?color=maroon */
  slug: string;
  label: string;
  /** Real product colour, not a theme token. */
  swatch: string;
  /** Substrings matched case-insensitively against a product colour. */
  keywords: string[];
}

export const COLOR_FAMILIES: ColorFamily[] = [
  { slug: "red", label: "Red", swatch: "#B3262E", keywords: ["red", "crimson", "scarlet", "ruby"] },
  { slug: "maroon", label: "Maroon", swatch: "#6D1A2A", keywords: ["maroon", "burgundy", "wine"] },
  { slug: "pink", label: "Pink", swatch: "#EBC3C0", keywords: ["pink", "blush", "peony", "magenta", "lavender", "coral"] },
  { slug: "blue", label: "Blue", swatch: "#2E4A9A", keywords: ["blue", "navy", "teal", "ocean"] },
  { slug: "green", label: "Green", swatch: "#2F6B4F", keywords: ["green", "sage", "forest"] },
  { slug: "gold", label: "Gold", swatch: "#C9A24B", keywords: ["gold", "brass", "champagne"] },
  { slug: "silver", label: "Silver", swatch: "#B8BCC2", keywords: ["silver", "platinum", "steel"] },
  { slug: "copper", label: "Copper", swatch: "#B87333", keywords: ["copper"] },
  { slug: "brown", label: "Brown & Kraft", swatch: "#8A6236", keywords: ["brown", "kraft", "natural", "sepia", "tan"] },
  { slug: "black", label: "Black", swatch: "#1A1A1A", keywords: ["black", "midnight"] },
  { slug: "white", label: "White", swatch: "#F7F7F5", keywords: ["white", "pearl"] },
  { slug: "ivory", label: "Ivory & Cream", swatch: "#F4ECD8", keywords: ["ivory", "cream"] },
  { slug: "grey", label: "Grey", swatch: "#8A8F98", keywords: ["grey", "gray", "slate"] },
];

const familyBySlug = new Map(COLOR_FAMILIES.map((f) => [f.slug, f]));

/** Families a single colour string belongs to (e.g. "White with Gold" -> white, gold). */
export function colorFamiliesFor(color: string): string[] {
  const haystack = color.toLowerCase();
  return COLOR_FAMILIES.filter((f) =>
    f.keywords.some((keyword) => haystack.includes(keyword)),
  ).map((f) => f.slug);
}

/** Every colour family offered by one product. */
export function productColorFamilies(colors?: string[]): Set<string> {
  const families = new Set<string>();
  for (const color of colors ?? []) {
    for (const slug of colorFamiliesFor(color)) families.add(slug);
  }
  return families;
}

/** Human-readable label for a `color` param, falling back to the raw slug. */
export function colorFamilyLabel(slug: string): string {
  return familyBySlug.get(slug)?.label ?? slug;
}