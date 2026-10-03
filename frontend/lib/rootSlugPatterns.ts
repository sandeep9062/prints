/* ============================================================
   ROOT SEO SLUG PARSER
   ------------------------------------------------------------
   Turns a root-level slug into a typed spec the /[slug] route
   can render, or null when the slug means "not one of ours".

   Printing-domain patterns we accept (all optional "printer"
   synonym on the city form):

     {category}-printing-in-{city}
     {category}-printer-in-{city}
     {category}-printing-near-{locality}

   Examples:
     wedding-cards-printing-in-chandigarh
     visiting-cards-printer-in-panchkula
     brochures-printing-near-sector-17-chandigarh

   Design notes:
   - Pure and synchronous: no network, no fs. Safe to call from
     generateStaticParams, generateMetadata and components.
   - Never throws. Garbage in → null out → the route 404s.
   - Fails closed against RESERVED_ROOT_SLUGS so the catch-all
     can never shadow a real page.
   ============================================================ */

import {
  getCategoryBySlug,
  getCityBySlug,
  getLocalityBySlug,
  isReservedRootSlug,
} from "@/lib/printCategories";

export type RootSeoSpecKind = "category-in-city" | "category-near-locality";

export interface ResolvedSlug {
  /** Always resolved — locality pages fall back to their parent city. */
  city: string;
  /** Present only when the URL named a city explicitly. */
  citySlug: string | null;
  /** Present only for `near` pages. */
  localitySlug: string | null;
  locality: string | null;
  categorySlug: string;
  /** Human labels, pre-joined so views never re-derive them. */
  categoryName: string;
  categorySingular: string;
  blurb: string;
  spec: { kind: RootSeoSpecKind };
}

/** Human label for a link list, e.g. "Wedding Cards in Chandigarh". */
export function quickLinkLabel(slug: string): string | null {
  const resolved = parseRootSlug(slug);
  if (!resolved) return null;
  if (resolved.spec.kind === "category-near-locality" && resolved.locality) {
    return `${resolved.categoryName} near ${resolved.locality}`;
  }
  return `${resolved.categoryName} in ${resolved.city}`;
}

const CITY_MARKER = "-printing-in-";
const PRINTER_MARKER = "-printer-in-";
const NEAR_MARKER = "-printing-near-";

/**
 * Split `{head}-{marker}{tail}` into its two halves.
 * Uses the LAST occurrence so a tail that itself contains the
 * marker text can never corrupt the head.
 */
function splitOnMarker(
  value: string,
  marker: string,
): { head: string; tail: string } | null {
  const at = value.lastIndexOf(marker);
  if (at <= 0) return null;
  const head = value.slice(0, at);
  const tail = value.slice(at + marker.length);
  if (!head || !tail) return null;
  return { head, tail };
}

function build(
  categorySlug: string,
  citySlug: string | null,
  localitySlug: string | null,
): ResolvedSlug | null {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  if (localitySlug) {
    const locality = getLocalityBySlug(localitySlug);
    if (!locality) return null;
    // Locality pages still need a city label — use the parent city.
    const parentCity = getCityBySlug(locality.citySlug);
    return {
      city: parentCity?.name ?? locality.name,
      citySlug: null,
      localitySlug: locality.slug,
      locality: locality.name,
      categorySlug: category.slug,
      categoryName: category.plural,
      categorySingular: category.singular,
      blurb: category.blurb,
      spec: { kind: "category-near-locality" },
    };
  }

  if (citySlug) {
    const city = getCityBySlug(citySlug);
    if (!city) return null;
    return {
      city: city.name,
      citySlug: city.slug,
      localitySlug: null,
      locality: null,
      categorySlug: category.slug,
      categoryName: category.plural,
      categorySingular: category.singular,
      blurb: category.blurb,
      spec: { kind: "category-in-city" },
    };
  }

  return null;
}

/**
 * Parse a root slug into a spec, or null if it is not one of ours.
 * Total function — never throws.
 */
export function parseRootSlug(rawSlug: string): ResolvedSlug | null {
  if (typeof rawSlug !== "string") return null;
  const slug = rawSlug.trim().toLowerCase();
  if (!slug || isReservedRootSlug(slug)) return null;

  const near = splitOnMarker(slug, NEAR_MARKER);
  if (near) {
    return build(near.head, null, near.tail);
  }

  const inCity = splitOnMarker(slug, CITY_MARKER);
  if (inCity) {
    return build(inCity.head, inCity.tail, null);
  }

  const printer = splitOnMarker(slug, PRINTER_MARKER);
  if (printer) {
    return build(printer.head, printer.tail, null);
  }

  return null;
}