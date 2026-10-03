/* ============================================================
   ROOT SEO METADATA COPY
   ------------------------------------------------------------
   Builds Next `Metadata` for the root-level programmatic SEO
   pages. Returns null when the slug is not one of ours so the
   caller can fall back to empty metadata (and 404 in the page).
   ============================================================ */

import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";
import type { ResolvedSlug } from "@/lib/rootSlugPatterns";

const TITLE_MAX = 60;

function clampTitle(value: string): string {
  if (value.length <= TITLE_MAX) return value;
  return `${value.slice(0, TITLE_MAX - 1).trimEnd()}…`;
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
  const place = isNear && resolved.locality ? resolved.locality : resolved.city;

  const title = clampTitle(
    isNear
      ? `${resolved.categoryName} Printing near ${place} | ${SITE_CONFIG.siteName}`
      : `${resolved.categorySingular} Printing in ${place} | ${SITE_CONFIG.siteName}`,
  );

  const description = isNear
    ? `${resolved.categoryName} printing near ${place}. ${resolved.blurb} Printed in-house at our ${SITE_CONFIG.address.city} press since 2004.`
    : `${resolved.categorySingular} printing in ${place}. ${resolved.blurb} Custom finishing, proof before print and bulk orders welcome.`;

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