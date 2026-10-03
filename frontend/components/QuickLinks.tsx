import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { parseRootSlug, quickLinkLabel } from "@/lib/rootSlugPatterns";
import type { ResolvedSlug } from "@/lib/rootSlugPatterns";
import { getRootSeoStaticParams } from "@/lib/seoListings";

/**
 * Homepage "popular searches" section — quick links to the programmatic SEO
 * landing pages (printing category + city, and category + locality pages).
 *
 * A server component on purpose: the link list is derived from the printing
 * taxonomy via `getRootSeoStaticParams()` — the same source `generateStaticParams`
 * uses — so it can never link to a URL the site itself would 404. Precomputed
 * slugs can be passed in via the `slugs` prop to skip the derivation.
 *
 * Long groups collapse behind a native <details> ("Show N more"). Every link
 * stays in the server-rendered HTML (crawlable, no client JS) — it's only
 * visually tucked away so the section doesn't grow endlessly on mobile.
 */
const BRAND = "hsl(var(--brand))";
const BRAND_TINT = "hsl(var(--brand-soft))";
const INK = "hsl(var(--foreground))";
const INK_SOFT = "hsl(var(--muted-foreground))";

export interface QuickLinkItem {
  href: string;
  label: string;
}

interface GroupAccent {
  color: string;
  tint: string;
  /** Full static class strings so Tailwind can see them at build time. */
  linkHover: string;
}

interface QuickLinkGroup {
  key: string;
  heading: string;
  blurb: string;
  icon: LucideIcon;
  accent: GroupAccent;
  items: QuickLinkItem[];
}

/** A group after the maxPerGroup cap is applied. */
interface ResolvedGroup extends QuickLinkGroup {
  /** Every link the group holds — may exceed `items.length` when capped. */
  total: number;
}

interface QuickLinksProps {
  title?: string;
  subtitle?: string;
  /** 0 = no cap (default) — show every eligible link. */
  maxPerGroup?: number;
  /**
   * How many links to show before collapsing the rest behind "Show N more".
   * Defaults to a value chosen from the column count (8 / 10 / 12).
   * 0 = never collapse.
   */
  collapseAfter?: number;
  /**
   * Heading id, wired to `aria-labelledby`. Defaults to a fixed value; pass a
   * distinct one if two <QuickLinks> ever render on the same page so ids stay
   * unique.
   */
  titleId?: string;
  /** Optional precomputed root slugs (default: derive from the taxonomy). */
  slugs?: string[];
}

/**
 * Which visual group a resolved slug belongs to. Every resolvable slug lands in
 * exactly one group, so this never returns "" — the caller's `if (!key)` guard
 * is kept as a cheap forward-compat tripwire if a new spec kind is ever added.
 */
function groupKeyFor(resolved: ResolvedSlug): string {
  return resolved.spec.kind === "category-in-city" ? "by-city" : "near-you";
}

function makeGroups(): QuickLinkGroup[] {
  return [
    {
      key: "by-city",
      heading: "Printing by City",
      blurb: "Category pages across our service cities",
      icon: MapPin,
      accent: {
        color: BRAND,
        tint: BRAND_TINT,
        linkHover:
          "hover:bg-brand-soft hover:text-brand focus-visible:ring-brand",
      },
      items: [],
    },
    {
      key: "near-you",
      heading: "Printing Near You",
      blurb: "Category pages by locality",
      icon: Compass,
      accent: {
        color: "hsl(var(--success))",
        tint: "hsl(var(--success) / 0.12)",
        linkHover:
          "hover:bg-success/10 hover:text-success focus-visible:ring-success",
      },
      items: [],
    },
  ];
}

const DEFAULT_TITLE = "Explore printing by category, finish & city";
const DEFAULT_SUBTITLE =
  "Popular printing categories across Chandigarh, Panchkula, Mohali and nearby localities — wedding cards, visiting cards, brochures, banners and more.";
/** Don't collapse for just a couple of leftovers ("Show 1 more" is silly). */
const COLLAPSE_SLACK = 2;

function LinkRow({
  item,
  hoverClass,
}: {
  item: QuickLinkItem;
  hoverClass: string;
}) {
  return (
    <li>
      <Link
        href={item.href}
        className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm leading-snug text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 ${hoverClass}`}
      >
        <span className="line-clamp-2">{item.label}</span>
        {/* Always faintly visible on touch (no hover there); reveals on hover for mouse users. */}
        <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40 transition-all md:opacity-0 md:group-hover:translate-x-0.5 md:group-hover:opacity-100" />
      </Link>
    </li>
  );
}

export default async function QuickLinks({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  // No cap by default: every slug the taxonomy yields is a real, prerendered
  // page, so each one is worth linking. Pass `maxPerGroup` to trim a group if
  // a page ever needs to stay compact.
  maxPerGroup = 0,
  collapseAfter,
  titleId = "quicklinks-title",
  slugs,
}: QuickLinksProps) {
  let rootSlugs: string[];
  try {
    rootSlugs = slugs ?? (await getRootSeoStaticParams()).map((p) => p.slug);
  } catch (error) {
    console.error("[QuickLinks] failed to derive links:", error);
    rootSlugs = [];
  }

  const groups = makeGroups();
  const byKey = new Map(groups.map((g) => [g.key, g] as const));
  const seen = new Set<string>();

  for (const slug of rootSlugs) {
    if (seen.has(slug)) continue;
    const resolved = parseRootSlug(slug);
    if (!resolved) continue;
    const key = groupKeyFor(resolved);
    if (!key) continue;
    const label = quickLinkLabel(slug);
    if (!label) continue;
    // Map lookup instead of `find(...)!` — a missing key skips rather than
    // throwing on a non-null assertion at runtime.
    const group = byKey.get(key);
    if (!group) continue;
    group.items.push({ href: `/${slug}`, label });
    seen.add(slug);
  }

  const activeGroups: ResolvedGroup[] = groups
    .filter((g) => g.items.length > 0)
    .map((g) => {
      const all = g.items.sort((a, b) => a.label.localeCompare(b.label));
      // Keep the true total even when `maxPerGroup` trims the rendered list —
      // the badge counts everything the group holds, not just what's visible.
      return {
        ...g,
        total: all.length,
        items: maxPerGroup > 0 ? all.slice(0, maxPerGroup) : all,
      };
    });

  // Nothing eligible → render nothing; the homepage stays clean.
  if (activeGroups.length === 0) return null;

  // Outer columns follow the number of active groups, so a full set of links
  // never stretches one narrow card down the page next to empty grid slots.
  const groupCount = activeGroups.length;
  const gridCols =
    groupCount === 1
      ? ""
      : groupCount === 2
        ? "sm:grid-cols-2"
        : groupCount === 3
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  // Inner link columns are only used when the card itself is wide enough for
  // them (a 3-col inner grid inside a ~280px card just truncates every label).
  const innerCols =
    groupCount === 1
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : groupCount === 2
        ? "lg:grid-cols-2"
        : "";
  const listClass = innerCols
    ? `grid grid-cols-1 gap-x-2 ${innerCols}`
    : "space-y-0.5";

  const autoVisible = groupCount === 1 ? 12 : groupCount === 2 ? 10 : 8;
  const visibleCount =
    collapseAfter === undefined ? autoVisible : collapseAfter;

  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ background: BRAND_TINT, color: BRAND }}
          >
            <Compass className="h-3.5 w-3.5" />
            Popular searches
          </span>
          <h2
            id={titleId}
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: INK }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-brand hover:text-primary-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Browse all products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className={`mt-8 grid gap-4 sm:gap-5 ${gridCols}`}>
        {activeGroups.map((group) => {
          const Icon = group.icon;
          const shouldCollapse =
            visibleCount > 0 &&
            group.items.length > visibleCount + COLLAPSE_SLACK;
          const shown = shouldCollapse
            ? group.items.slice(0, visibleCount)
            : group.items;
          const hidden = shouldCollapse ? group.items.slice(visibleCount) : [];

          return (
            <div
              key={group.key}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* accent bar */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: group.accent.color }}
              />

              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: group.accent.tint,
                    color: group.accent.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-sm font-bold"
                    style={{ color: INK }}
                  >
                    {group.heading}
                  </h3>
                  <p
                    className="truncate text-[11px]"
                    style={{ color: INK_SOFT }}
                  >
                    {group.blurb}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{
                    background: group.accent.tint,
                    color: group.accent.color,
                  }}
                  title={`${group.total} links`}
                >
                  {group.total}
                </span>
              </div>

              <ul aria-label={group.heading} className={`mt-3 ${listClass}`}>
                {shown.map((item) => (
                  <LinkRow
                    key={item.href}
                    item={item}
                    hoverClass={group.accent.linkHover}
                  />
                ))}
              </ul>

              {hidden.length > 0 && (
                <details className="group/more mt-1">
                  <summary
                    className="flex cursor-pointer list-none items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
                    style={{ color: group.accent.color }}
                  >
                    <span className="group-open/more:hidden">
                      Show {hidden.length} more
                    </span>
                    <span className="hidden group-open/more:inline">
                      Show less
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open/more:rotate-180" />
                  </summary>
                  <ul
                    aria-label={`${group.heading} (more)`}
                    className={`mt-1 ${listClass}`}
                  >
                    {hidden.map((item) => (
                      <LinkRow
                        key={item.href}
                        item={item}
                        hoverClass={group.accent.linkHover}
                      />
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
