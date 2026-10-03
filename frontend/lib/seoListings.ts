/* ============================================================
   ROOT SEO STATIC PARAMS
   ------------------------------------------------------------
   The canonical list of root-level programmatic SEO slugs.

   Derived from the taxonomy (categories x cities, plus
   category x locality) rather than hand-maintained, so adding a
   category or a service city automatically produces its pages
   everywhere: sitemap, generateStaticParams and the homepage
   quick-links block all read from here.

   Pure and synchronous — no network, no fs. Safe to call from
   generateStaticParams and from cached server components.
   ============================================================ */

import {
  PRINT_CATEGORIES,
  SERVICE_CITIES,
  SERVICE_LOCALITIES,
  isReservedRootSlug,
} from "@/lib/printCategories";
import { parseRootSlug } from "@/lib/rootSlugPatterns";

export interface RootSeoParam {
  slug: string;
}

function buildCitySlugs(): string[] {
  const slugs: string[] = [];
  for (const category of PRINT_CATEGORIES) {
    for (const city of SERVICE_CITIES) {
      slugs.push(`${category.slug}-printing-in-${city.slug}`);
    }
  }
  return slugs;
}

function buildLocalitySlugs(): string[] {
  const slugs: string[] = [];
  for (const category of PRINT_CATEGORIES) {
    for (const locality of SERVICE_LOCALITIES) {
      slugs.push(`${category.slug}-printing-near-${locality.slug}`);
    }
  }
  return slugs;
}

/**
 * Every slug we are willing to pre-render, de-duplicated and
 * filtered through the parser so a malformed entry can never
 * ship as a page that 404s.
 */
export function getRootSeoSlugs(): string[] {
  const candidates = [...buildCitySlugs(), ...buildLocalitySlugs()];
  const seen = new Set<string>();
  const out: string[] = [];

  for (const slug of candidates) {
    if (seen.has(slug) || isReservedRootSlug(slug)) continue;
    if (!parseRootSlug(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }

  return out;
}

/**
 * Shape expected by Next's `generateStaticParams`.
 * Async so callers can `await` it uniformly with any future
 * data-backed source.
 */
export async function getRootSeoStaticParams(): Promise<RootSeoParam[]> {
  return getRootSeoSlugs().map((slug) => ({ slug }));
}