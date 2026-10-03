import Link from "next/link";
import { ArrowRight, MapPin, Printer, Sparkles } from "lucide-react";

import { SITE_CONFIG } from "@/lib/seo";
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
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ── HERO ── */}
      <section className="border-b border-slate-100 bg-[#EEF1FC]/40">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#4161df] ring-1 ring-[#4161df]/20">
            <Printer size={13} />
            Printing press · est. 2004
          </span>

          <h1 className="mt-6 font-[Poppins] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            {category ? category.plural : "Custom printing"}{" "}
            <span className="text-[#4161df]">
              {isNear ? `near ${place}` : `in ${place}`}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-600">
            {blurb}
          </p>

          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={15} className="text-[#4161df]" />
            {isNear
              ? `Serving ${locality} and surrounding areas`
              : `Delivering across ${city}`}
            {" · "}
            In-house production at our {SITE_CONFIG.address.city} press
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/other-services/register"
              className="inline-flex items-center gap-2 rounded-md bg-[#4161df] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#3456df]"
            >
              Get a quote
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-[15px] font-medium text-slate-900 transition-colors hover:border-[#4161df] hover:text-[#4161df]"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
      {/* ── WHAT WE OFFER ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-[Poppins] text-2xl font-bold tracking-tight">
          What you get
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUE_PROPS.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
            >
              <Sparkles
                size={16}
                className="mt-0.5 shrink-0 text-[#4161df]"
              />
              <span className="text-[14.5px] leading-relaxed text-slate-600">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── RELATED CATEGORIES ── */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
          <h2 className="font-[Poppins] text-2xl font-bold tracking-tight">
            Other things we print
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}-printing-in-${siblingCitySlug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#4161df]/40 hover:bg-[#EEF1FC] hover:text-[#4161df]"
              >
                {c.plural}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY CITIES ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-[Poppins] text-2xl font-bold tracking-tight">
          We also deliver in
        </h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {nearbyPlaces.map((c) => (
            <Link
              key={c.slug}
              href={`/${categorySlug}-printing-in-${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#4161df]/40 hover:bg-[#EEF1FC] hover:text-[#4161df]"
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