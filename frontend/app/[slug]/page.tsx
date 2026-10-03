import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoListingsPage from "@/components/SeoListingsPage";
import { getLandmarkBySlug } from "@/lib/landmarks";
import { parseRootSlug } from "@/lib/rootSlugPatterns";
import { buildRootSeoMetadata } from "@/lib/seoCopy";
import { getRootSeoStaticParams } from "@/lib/seoListings";

/*
 * Root-level flat programmatic SEO pages: /app/[slug]/page.tsx
 *   /property-for-rent-in-mohali-under-10-thousand          (price bucket)
 *   /pg-in-sector-14-chandigarh                             (sector + PG)
 *   /house-for-rent-in-sector-12-chandigarh                 (sector + category)
 *   /flat-for-rent-near-pgi-chandigarh                      (landmark)
 *
 * Next.js resolves static routes before dynamic ones at the same level, so
 * this catch-all can never swallow existing literal routes
 * (/privacy-policy, /projects, /properties, /property/[slug], /refund, …).
 * A regression test in lib/__tests__/rootSlugPatterns.test.ts asserts that
 * `parseRootSlug` returns null for every existing top-level route name.
 *
 * generateStaticParams is sourced from live inventory (eligibleSeoCombos +
 * eligibleLandmarkSeoCombos + the fixed price buckets) — same principle as
 * the sitemap generator, never hand-maintained. Unlisted slugs render on
 * demand (dynamicParams defaults to true) and 404 below the
 * MIN_LISTINGS_FOR_SEO_PAGE guardrail.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getRootSeoStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolved = parseRootSlug(slug);
  if (!resolved) return {};
  const landmark = resolved.landmarkSlug
    ? getLandmarkBySlug(resolved.city, resolved.landmarkSlug)
    : null;
  return buildRootSeoMetadata(resolved, landmark) ?? {};
}

export default async function RootSeoPage({ params }: Props) {
  const { slug } = await params;
  const resolved = parseRootSlug(slug);
  // Unknown patterns → 404. parseRootSlug never throws on garbage input.
  if (!resolved) notFound();

  // TODO(open decision #1): `independent-room` (candidate mapping:
  // allowsSubletting === true on any propertyCategory) and `flatmate`
  // (candidate mapping: allowsSubletting === true AND maxPersonsSharing > 1)
  // URL types await confirmation of that mapping before going live.
  // parseRootSlug still resolves them into valid specs; until the mapping is
  // confirmed we simply 404 rather than silently treating these as
  // Apartment/Flat.
  if (
    resolved.spec.kind === "independent-room" ||
    resolved.spec.kind === "flatmate"
  ) {
    notFound();
  }

  return (
    <SeoListingsPage
      city={resolved.city}
      sectorSlug={resolved.sectorSlug}
      landmarkSlug={resolved.landmarkSlug}
      spec={resolved.spec}
    />
  );
}