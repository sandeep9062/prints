import Link from "next/link";
import { IndianRupee, LayoutGrid, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Homepage quick links: the fastest way to reach the right product.
 * Browse by type, by price or by colour, plus a row of popular finishes.
 *
 * A plain server component with static data: every link is in the
 * server-rendered HTML (crawlable, no client JS).
 *
 * IMPORTANT: the price and colour URLs below assume your /products page reads
 * `minPrice`, `maxPrice` and `color` query params. If your filters use other
 * names, change PARAMS once and every link follows.
 */

export interface QuickLinkItem {
  href: string;
  label: string;
}

export interface ColorLinkItem extends QuickLinkItem {
  /** Product colour shown in the dot. Real product colours, not theme tokens. */
  swatch: string;
}

interface QuickLinksProps {
  title?: string;
  subtitle?: string;
  titleId?: string;
  types?: QuickLinkItem[];
  prices?: QuickLinkItem[];
  colors?: ColorLinkItem[];
  styles?: QuickLinkItem[];
}

// --- URL helpers ---

const PARAMS = { minPrice: "minPrice", maxPrice: "maxPrice", color: "color" };

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const typeHref = (slug: string) => `/products?category=${slug}`;

// Same pattern as the navbar, so these match the ?subcategory= filter.
const styleHref = (category: string, sub: string) =>
  `/products?category=${category}&subcategory=${slugify(sub)}`;

const priceHref = (min?: number, max?: number) => {
  const q = new URLSearchParams();
  if (min !== undefined) q.set(PARAMS.minPrice, String(min));
  if (max !== undefined) q.set(PARAMS.maxPrice, String(max));
  return `/products?${q.toString()}`;
};

const colorHref = (slug: string) => `/products?${PARAMS.color}=${slug}`;

// --- Default data (edit freely) ---

const DEFAULT_TYPES: QuickLinkItem[] = [
  { label: "Wedding Cards", href: typeHref("wedding-cards") },
  { label: "Invitation Cards", href: typeHref("invitation-cards") },
  { label: "Visiting Cards", href: typeHref("visiting-cards") },
  { label: "Shagun Cards", href: typeHref("shagun-cards") },
  { label: "Letter Pads", href: typeHref("letter-pads") },
  { label: "Brochures & Catalogs", href: typeHref("brochures") },
];

// Placeholder ranges: replace with the ranges that match your real prices.
const DEFAULT_PRICES: QuickLinkItem[] = [
  { label: "Under ₹100", href: priceHref(undefined, 100) },
  { label: "₹100 to ₹300", href: priceHref(100, 300) },
  { label: "₹300 to ₹500", href: priceHref(300, 500) },
  { label: "₹500 to ₹1,000", href: priceHref(500, 1000) },
  { label: "Above ₹1,000", href: priceHref(1000, undefined) },
];

const DEFAULT_COLORS: ColorLinkItem[] = [
  { label: "Red", swatch: "#B3262E", href: colorHref("red") },
  { label: "Maroon", swatch: "#6D1A2A", href: colorHref("maroon") },
  { label: "Gold", swatch: "#C9A24B", href: colorHref("gold") },
  { label: "Ivory", swatch: "#F4ECD8", href: colorHref("ivory") },
  { label: "Pink", swatch: "#EBC3C0", href: colorHref("pink") },
  { label: "Blue", swatch: "#2E4A9A", href: colorHref("blue") },
  { label: "Green", swatch: "#2F6B4F", href: colorHref("green") },
  { label: "Black", swatch: "#1A1A1A", href: colorHref("black") },
];

const DEFAULT_STYLES: QuickLinkItem[] = [
  {
    label: "Premium Gold Foil",
    href: styleHref("wedding-cards", "Premium Gold Foil"),
  },
  { label: "Floral Suite", href: styleHref("wedding-cards", "Floral Suite") },
  {
    label: "Traditional Mandap",
    href: styleHref("wedding-cards", "Traditional Mandap"),
  },
  {
    label: "Minimalist White",
    href: styleHref("wedding-cards", "Minimalist White"),
  },
  { label: "Spot UV", href: styleHref("visiting-cards", "Spot UV") },
  {
    label: "Luxury Velvet",
    href: styleHref("visiting-cards", "Luxury Velvet"),
  },
  { label: "Matte Finish", href: styleHref("visiting-cards", "Matte Finish") },
  {
    label: "Eco-friendly Card",
    href: styleHref("visiting-cards", "Eco-friendly Card"),
  },
];

const DEFAULT_TITLE = "Find your print faster";
const DEFAULT_SUBTITLE =
  "Browse by type, price or colour, and go straight to the designs that fit.";

// --- Shared styles ---

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const rowLink = `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-brand-soft hover:text-brand motion-reduce:transition-none ${focusRing}`;

function Panel({
  icon: Icon,
  heading,
  blurb,
  children,
}: {
  icon: LucideIcon;
  heading: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6">
      <div className="flex items-start gap-3 border-b border-border pb-5">
        <Icon
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-gold"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {heading}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function QuickLinks({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  titleId = "quicklinks-title",
  types = DEFAULT_TYPES,
  prices = DEFAULT_PRICES,
  colors = DEFAULT_COLORS,
  styles = DEFAULT_STYLES,
}: QuickLinksProps) {
  if (!types.length && !prices.length && !colors.length && !styles.length) {
    return null;
  }

  return (
    <section
      aria-labelledby={titleId}
      className="border-t border-border bg-background py-20 lg:py-24"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2
              id={titleId}
              className="font-serif text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href="/products"
            className={`inline-flex h-12 shrink-0 items-center justify-center self-start rounded-full border border-foreground/40 px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground/5 motion-reduce:transition-none md:self-auto ${focusRing}`}
          >
            Browse all products
          </Link>
        </div>

        {/* Type / price / colour */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {types.length > 0 && (
            <Panel icon={LayoutGrid} heading="By type" blurb="Pick a product">
              <ul aria-label="Shop by type" className="mt-4 space-y-0.5">
                {types.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className={rowLink}>
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {prices.length > 0 && (
            <Panel
              icon={IndianRupee}
              heading="By price"
              blurb="Set your budget"
            >
              <ul aria-label="Shop by price" className="mt-4 space-y-0.5">
                {prices.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className={rowLink}>
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {colors.length > 0 && (
            <Panel icon={Palette} heading="By colour" blurb="Match your theme">
              <ul
                aria-label="Shop by colour"
                className="mt-4 grid grid-cols-2 gap-x-2 gap-y-0.5"
              >
                {colors.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className={rowLink}>
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 rounded-full ring-1 ring-foreground/20"
                        style={{ backgroundColor: c.swatch }}
                      />
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {/* Popular finishes and styles */}
        {styles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-medium text-muted-foreground">
              Popular finishes and styles
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {styles.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className={`inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand motion-reduce:transition-none ${focusRing}`}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
