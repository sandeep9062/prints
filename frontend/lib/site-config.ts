/**
 * Single source of truth for brand identity and company facts.
 *
 * Copy that repeats across the site (SEO metadata, schema.org JSON-LD, footer,
 * about/contact pages) used to hard-code the brand name, the legal operator and
 * the founding year in ~30 places, which is how the site ended up claiming both
 * "since 1984" and "since 2004" at once. Import from here instead.
 *
 * NOTE: no application logic, routes or API contracts depend on this file —
 * it only feeds display strings and SEO metadata.
 */

/** Consumer-facing brand name. Used in headings, metadata and schema.org. */
export const BRAND_NAME = "Ink of Memories";

/**
 * Legal operator name, used in the disclaimer, terms and copyright lines where
 * the registered entity has to be named.
 */
export const LEGAL_NAME = "Ink of Memories";

/** Year the press was founded. Single authoritative value — see the note above. */
export const FOUNDED_YEAR = 1984;

/**
 * Whole years since {@link FOUNDED_YEAR}, computed at call time so it never
 * goes stale. Returns 0 before the founding year rather than a negative number.
 */
export function yearsInBusiness(from: number = FOUNDED_YEAR): number {
  return Math.max(0, new Date().getFullYear() - from);
}