import Link from "next/link";
import { ArrowRight, MapPin, Printer, Sparkles } from "lucide-react";

import { SITE_CONFIG } from "@/lib/seo";
import { FOUNDED_YEAR } from "@/lib/site-config";
import {
  PRINT_CATEGORIES,
  SERVICE_CITIES,
  getCategoryBySlug,
} from "@/lib/printCategories";

export interface SeoListingsPageProps {
  /** City slug from the URL ("chandigarh") or null for locality pages. */
  citySlug: string | null;
  /** Human city label, always present. */
  city: string;
  /** Locality slug for `near` pages, else null. */
  localitySlug: string | null;
  locality: string | null;
  categorySlug: string;
  blurb: string;
}

const VALUE_PROPS = [
  "Proof before we press — approve a physical sample first",
  "Custom paper, foil, emboss and matte finishing",
  "Bulk and corporate quantities with tiered pricing",
  "Design help from our in-house team at no extra cost",
];

/**
 * Landing page for a root-level programmatic SEO route, e.g.
 *   /wedding-cards-printing-in-chandigarh
 *   /brochures-printing-near-sector-17-chandigarh
 *
 * A server component: no client JS needed for the content itself.
 * Everything it renders comes from static taxonomy data, so the
 * page is fully prerenderable and cheap to serve.
 */
export default function SeoListingsPage({
  citySlug,
  city,
  localitySlug,
  locality,
  categorySlug,
  blurb,
}: SeoListingsPageProps) {
  const category = getCategoryBySlug(categorySlug);
  const place = locality ?? city;
  const isNear = Boolean(localitySlug);

  // Sibling categories — natural internal linking.
  const relatedCategories = PRINT_CATEGORIES.filter(
    (c) => c.slug !== categorySlug,
  ).slice(0, 6);

  // Nearby places worth linking to.
  const nearbyPlaces = SERVICE_CITIES.filter((c) => c.slug !== citySlug).slice(
    0,
    5,
  );

  // Locality pages have no city slug of their own, so sibling-category
  // links fall back to the studio's home city rather than 404ing.
  const siblingCitySlug = citySlug ?? "chandigarh";

  return (
    <main className="min-h-screen bg-card text-foreground antialiased">
      {/* ── HERO ── */}
      <section className="border-b border-border bg-brand-soft/40">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/20">
            <Printer size={13} />
            Printing press · est. {FOUNDED_YEAR}
          </span>

          <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            {category ? category.plural : "Custom printing"}{" "}
            <span className="text-brand">
              {isNear ? `near ${place}` : `in ${place}`}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            {blurb}
          </p>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={15} className="text-brand" />
            {isNear
              ? `Serving ${locality} and surrounding areas`
              : `Delivering across ${city}`}
            {" · "}
            In-house production at our {SITE_CONFIG.address.city} press
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/other-services/register"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-brand-hover"
            >
              Get a quote
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:border-brand"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
      {/* ── WHAT WE OFFER ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight">
          What you get
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUE_PROPS.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
            >
              <Sparkles
                size={16}
                className="mt-0.5 shrink-0 text-brand"
              />
              <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── RELATED CATEGORIES ── */}
      <section className="border-t border-border bg-muted/60">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
          <h2 className="font-sans text-2xl font-semibold tracking-tight">
            Other things we print
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}-printing-in-${siblingCitySlug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
              >
                {c.plural}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY CITIES ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight">
          We also deliver in
        </h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {nearbyPlaces.map((c) => (
            <Link
              key={c.slug}
              href={`/${categorySlug}-printing-in-${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
            >
              <MapPin size={13} />
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}