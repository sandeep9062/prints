/* ============================================================
   ROOT SEO METADATA COPY
   ------------------------------------------------------------
   Builds Next `Metadata` for the root-level programmatic SEO
   pages. Returns null when the slug is not one of ours so the
   caller can fall back to empty metadata (and 404 in the page).
   ============================================================ */

import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";
import { FOUNDED_YEAR } from "@/lib/site-config";
import { SERVICE_LOCALITIES } from "@/lib/printCategories";
import type { ResolvedSlug } from "@/lib/rootSlugPatterns";

const TITLE_MAX = 60;

/**
 * Budget the page-specific part of the title so that
 * "<part> | Ink of Memories" lands inside the ~60 character display window.
 *
 * Clamping the *whole* title instead truncated the brand name off the end
 * ("...near Manimajra, Chandigarh | Ink of…"), which wastes the part of the
 * title that actually carries recognition and search weight.
 */
const BRAND_SUFFIX = ` | ${SITE_CONFIG.siteName}`;
const TITLE_BODY_MAX = TITLE_MAX - BRAND_SUFFIX.length;

function clampTitleBody(value: string): string {
  if (value.length <= TITLE_BODY_MAX) return value;
  return `${value.slice(0, TITLE_BODY_MAX - 1).trimEnd()}…`;
}

/**
 * True when more than one served locality shares this display name.
 *
 * Derived from the taxonomy at module scope rather than hard-coded, so adding a
 * second "Model Town" or renaming a locality keeps titles unique automatically.
 */
const AMBIGUOUS_LOCALITY_NAMES: ReadonlySet<string> = (() => {
  const counts = new Map<string, number>();
  for (const locality of SERVICE_LOCALITIES) {
    counts.set(locality.name, (counts.get(locality.name) ?? 0) + 1);
  }
  return new Set(
    [...counts.entries()].filter(([, count]) => count > 1).map(([name]) => name),
  );
})();

function isAmbiguousLocalityName(name: string | null): boolean {
  return !!name && AMBIGUOUS_LOCALITY_NAMES.has(name);
}

/**
 * Uppercase the first letter only.
 *
 * `PRINT_CATEGORIES` stores singular labels in lower case ("wedding card") because
 * they are written mid-sentence in descriptions. Dropped straight into a <title>
 * they produced "wedding card printing in Chandigarh", which reads like a slug
 * rather than a headline.
 */
function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// The root layout declares `title.template: "%s | Ink of Memories"`, so a plain
// string would be suffixed a second time. `absolute` opts out of the template.
export function buildRootSeoMetadata(
  resolved: ResolvedSlug,
  /** Canonical slug; when omitted the canonical tag is omitted. */
  slug?: string,
): Metadata | null {
  if (!resolved) return null;

  const isNear = resolved.spec.kind === "category-near-locality";

  /*
    Disambiguate the locality label.

    `SERVICE_LOCALITIES` deliberately contains `manimajra-chandigarh` AND
    `manimajra-panchkula` — two genuinely different areas that happen to share a
    name. Using the bare locality name produced two pages with an identical
    title ("Wedding Cards Printing near Manimajra | Ink of Memories") and an
    identical description, which Google treats as duplicate content and picks one
    to drop.

    Prefixing the owning city only when the locality name would otherwise be
    ambiguous keeps the common case ("near Sector 17") reading naturally while
    guaranteeing uniqueness where it matters.
  */
  const placeLabel =
    isNear && isAmbiguousLocalityName(resolved.locality)
      ? `${resolved.locality}, ${resolved.city}`
      : isNear && resolved.locality
        ? resolved.locality
        : resolved.city;

  /*
    Title body, clamped to TITLE_BODY_MAX before the brand suffix is attached.

    Wording is deliberately terse ("Books & Bindings near Manimajra") because the
    full "X Printing near Y" form overflowed the budget for the longer category
    labels. When it overflowed, clampTitleBody cut the trailing ", Panchkula" —
    the very disambiguator that separates the two Manimajra pages — and they
    collapsed back onto an identical title.
  */
  const title = `${clampTitleBody(
    isNear
      ? `${resolved.categoryName} near ${placeLabel}`
      : `${sentenceCase(resolved.categorySingular)} printing in ${placeLabel}`,
  )}${BRAND_SUFFIX}`;

  const description = isNear
    ? `${resolved.categoryName} printing near ${placeLabel}. ${resolved.blurb} Printed in-house at our ${SITE_CONFIG.address.city} press since ${FOUNDED_YEAR}.`
    : `${resolved.categorySingular} printing in ${placeLabel}. ${resolved.blurb} Custom finishing, proof before print and bulk orders welcome.`;

  const url = slug ? `${SITE_CONFIG.url}/${slug}` : SITE_CONFIG.url;

  return {
    title: { absolute: title },
    description,
    ...(slug ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      type: "website",
      images: [{ url: SITE_CONFIG.defaultImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.defaultImage],
    },
  };
}