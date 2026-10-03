import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoListingsPage from "@/components/SeoListingsPage";
import { parseRootSlug } from "@/lib/rootSlugPatterns";
import { buildRootSeoMetadata } from "@/lib/seoCopy";
import { getRootSeoStaticParams } from "@/lib/seoListings";

/*
 * Root-level flat programmatic SEO pages: /app/[slug]/page.tsx
 *   /wedding-cards-printing-in-chandigarh            (category + city)
 *   /visiting-cards-printer-in-panchkula             (synonym wording)
 *   /brochures-printing-near-sector-17-chandigarh   (category + locality)
 *
 * Next.js resolves static routes before dynamic ones at the same level, so
 * this catch-all can never swallow existing literal routes
 * (/privacy-policy, /products, /blog, /about-us, …). As a second line of
 * defence `parseRootSlug` returns null for every reserved top-level route
 * name (see RESERVED_ROOT_SLUGS in lib/printCategories.ts).
 *
 * generateStaticParams is sourced from the printing taxonomy in
 * lib/printCategories.ts (categories x cities, categories x localities) —
 * never hand-maintained. Unlisted slugs render on demand
 * (dynamicParams defaults to true) and 404 when they don't match a
 * known pattern.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getRootSeoStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolved = parseRootSlug(slug);
  if (!resolved) return {};
  return buildRootSeoMetadata(resolved, slug.toLowerCase()) ?? {};
}

export default async function RootSeoPage({ params }: Props) {
  const { slug } = await params;
  const resolved = parseRootSlug(slug);
  // Unknown patterns → 404. parseRootSlug never throws on garbage input.
  if (!resolved) notFound();

  return (
    <SeoListingsPage
      city={resolved.city}
      citySlug={resolved.citySlug}
      localitySlug={resolved.localitySlug}
      locality={resolved.locality}
      categorySlug={resolved.categorySlug}
      blurb={resolved.blurb}
    />
  );
}