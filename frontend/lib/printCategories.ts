/* ============================================================
   PRINTING DOMAIN TAXONOMY
   ------------------------------------------------------------
   Single source of truth for the programmatic SEO layer that
   powers the root-level flat pages (/[slug]) — printing categories,
   the cities we actually deliver in, and the localities used for
   "near me" pages.

   Everything here is static, hand-maintained data on purpose: these
   are our OWN service lines and service areas, not inventory rows.
   Nothing in this file talks to the network, so it is safe to import
   from `generateStaticParams`, metadata builders and components
   alike.

   Slug shape (always lowercase, hyphen separated):
     wedding-cards-printing-in-chandigarh
     visiting-cards-printer-in-panchkula
     brochures-printing-near-sector-17-chandigarh
   ============================================================ */

export interface PrintCategory {
  slug: string;
  /** Singular, used inside sentences ("wedding card printing"). */
  singular: string;
  /** Plural, used for link labels and headings ("Wedding Cards"). */
  plural: string;
  /** One line for meta descriptions and hero copy. */
  blurb: string;
}

export const PRINT_CATEGORIES: PrintCategory[] = [
  {
    slug: "wedding-cards",
    singular: "wedding card",
    plural: "Wedding Cards",
    blurb:
      "Hand-pressed wedding invitations on premium card stock, with foil, emboss and matte lamination.",
  },
  {
    slug: "invitation-cards",
    singular: "invitation card",
    plural: "Invitation Cards",
    blurb:
      "Birthday, engagement, mehndi, pooja and festival invitations printed to order.",
  },
  {
    slug: "visiting-cards",
    singular: "visiting card",
    plural: "Visiting Cards",
    blurb:
      "Business and personal visiting cards with spot UV, foil and rounded corners.",
  },
  {
    slug: "shagun-envelopes",
    singular: "shagun envelope",
    plural: "Shagun Envelopes",
    blurb:
      "Shagun and money envelopes in traditional motifs, matched to your card design.",
  },
  {
    slug: "letter-pads",
    singular: "letter pad",
    plural: "Letter Pads",
    blurb:
      "Custom letter pads and notepads on 70–120 gsm stock with your logo and footer.",
  },
  {
    slug: "brochures",
    singular: "brochure",
    plural: "Brochures",
    blurb: "Folded and saddle-stitched brochures, catalogues and literature.",
  },
  {
    slug: "banners",
    singular: "banner",
    plural: "Banners & Flex",
    blurb: "Flex, vinyl and roller banners for shops, events and site boards.",
  },
  {
    slug: "stickers",
    singular: "sticker",
    plural: "Stickers",
    blurb: "Die-cut, matte and glossy stickers for packaging, branding and events.",
  },
  {
    slug: "books-bindings",
    singular: "book",
    plural: "Books & Bindings",
    blurb: "Softcover and hardcover binding, spiral binding and perfect binding.",
  },
  {
    slug: "rubber-stamps",
    singular: "rubber stamp",
    plural: "Rubber Stamps",
    blurb: "Self-inking and traditional rubber stamps, refilled and serviced in-house.",
  },
];

export interface ServiceCity {
  slug: string;
  name: string;
}

export const SERVICE_CITIES: ServiceCity[] = [
  { slug: "chandigarh", name: "Chandigarh" },
  { slug: "panchkula", name: "Panchkula" },
  { slug: "mohali", name: "Mohali" },
  { slug: "zirakpur", name: "Zirakpur" },
  { slug: "new-chandigarh", name: "New Chandigarh" },
  { slug: "manimajra", name: "Manimajra" },
  { slug: "derabassi", name: "Derabassi" },
];

export interface ServiceLocality {
  slug: string;
  name: string;
  /** Owning city slug — keeps locality pages attributable to a city. */
  citySlug: string;
}

export const SERVICE_LOCALITIES: ServiceLocality[] = [
  { slug: "sector-17-chandigarh", name: "Sector 17", citySlug: "chandigarh" },
  { slug: "sector-22-chandigarh", name: "Sector 22", citySlug: "chandigarh" },
  { slug: "manimajra-chandigarh", name: "Manimajra", citySlug: "chandigarh" },
  { slug: "sector-20-panchkula", name: "Sector 20", citySlug: "panchkula" },
  { slug: "manimajra-panchkula", name: "Manimajra", citySlug: "panchkula" },
  { slug: "phase-7-mohali", name: "Phase 7", citySlug: "mohali" },
  { slug: "phase-5-mohali", name: "Phase 5", citySlug: "mohali" },
];

const categoryBySlug = new Map(
  PRINT_CATEGORIES.map((c) => [c.slug, c] as const),
);
const cityBySlug = new Map(SERVICE_CITIES.map((c) => [c.slug, c] as const));
const localityBySlug = new Map(
  SERVICE_LOCALITIES.map((l) => [l.slug, l] as const),
);

export function getCategoryBySlug(slug: string): PrintCategory | undefined {
  return categoryBySlug.get(slug);
}

export function getCityBySlug(slug: string): ServiceCity | undefined {
  return cityBySlug.get(slug);
}

export function getLocalityBySlug(
  slug: string,
): ServiceLocality | undefined {
  return localityBySlug.get(slug);
}

/* ------------------------------------------------------------
   RESERVED ROUTES
   ------------------------------------------------------------
   /[slug] is a root-level catch-all, so it MUST refuse every
   existing top-level route — otherwise a route added later
   without updating this list would be shadowed by a 404 from
   the SEO layer.

   Next.js resolves static segments before dynamic ones at the
   same level, so in practice this is a belt-and-braces guard
   (and a cheap regression tripwire): parseRootSlug always
   returns null for a name that appears here.
   ------------------------------------------------------------ */
export const RESERVED_ROOT_SLUGS: ReadonlySet<string> = new Set([
  "about-us",
  "admin-dashboard",
  "auth",
  "become-a-merchant",
  "blog",
  "business",
  "cart",
  "compare",
  "contact",
  "customize",
  "disclaimer",
  "favicon.ico",
  "favourites",
  "merchant-dashboard",
  "my-account",
  "other-services",
  "privacy-policy",
  "products",
  "profile",
  "refund",
  "terms",
]);

/** Locale-ish noise that should never resolve to a real page. */
export function isReservedRootSlug(slug: string): boolean {
  return (
    RESERVED_ROOT_SLUGS.has(slug) ||
    slug === "" ||
    slug.startsWith("_") ||
    slug.startsWith(".") ||
    slug.startsWith("api")
  );
}