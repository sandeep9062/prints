// ============================================================
// SEO Constants & Configuration for Ink of Memories
// ============================================================

import type { Metadata } from "next";

import { BRAND_NAME, FOUNDED_YEAR, LEGAL_NAME } from "./site-config";

export const SITE_CONFIG = {
  name: BRAND_NAME,
  businessName: LEGAL_NAME,
  tagline: "Premium Printing & Design Services",
  fullName: `${BRAND_NAME} | Premium Printing`,
  description:
    `Premium printing services from ${LEGAL_NAME} since ${FOUNDED_YEAR}. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts. Custom printing with hand-pressed quality in Panchkula.`,
  shortDescription:
    "Premium printing services for weddings, business & personal needs. Custom invitation cards, visiting cards & packaging.",
  url: "https://inkofmemories.com",
  /*
    Served by app/opengraph-image.tsx (Satori, rendered at build time). It is a
    real 1200x630 PNG, which the old `inkofmemories.png` was not — that file is a
    6250x6250 square, so every declared `width=1200 height=630` was a lie and
    social platforms cropped the preview into an unreadable sliver.

    Kept as an absolute URL because this object is also consumed outside React
    (e.g. schema.org `image`), where there is no `metadataBase` to resolve against.
  */
  defaultImage: "https://inkofmemories.com/opengraph-image",
  /*
    Points at logo-directory.png, not inkofmemories.png.

    Google requires an Organization `logo` to be at least 112x112px and to fit
    within a 1,000,000px bounding box. inkofmemories.png is a 388x108 wordmark
    — under half the minimum height, so it is ineligible for the knowledge panel
    and silently ignored.

    logo-directory.png (1536x1024) clears the minimum comfortably. Swap to a
    dedicated icon-only asset if one is ever exported from the brand spec — it
    calls for public/logo.svg, which does not exist in the repo yet.
  */
  logo: "https://inkofmemories.com/logo-directory.png",
  favicon: "/favicon.ico",
  locale: "en_IN",
  language: "en",
  siteName: BRAND_NAME,
  keywords: [
    "printing press",
    "wedding cards",
    "invitation cards",
    "visiting cards",
    "business cards",
    "brochure printing",
    "banner printing",
    "packaging printing",
    "custom printing",
    "gold foil printing",
    "Panchkula printing",
    "Chandigarh printing",
    "Ink of Memories",
    "premium printing India",
  ],
  social: {
    facebook: "https://facebook.com/inkofmemories",
    instagram: "https://instagram.com/inkofmemories",
    whatsapp: "+919876543210",
  },
  address: {
    street: "Sector 20",
    city: "Panchkula",
    state: "Haryana",
    pincode: "134116",
    country: "India",
  },
  contact: {
    phone: "+919876543210",
    email: "info@inkofmemories.com",
  },
  openHours: {
    weekdays: "Mon - Sat: 9:00 AM - 7:00 PM",
    sunday: "Sunday: Closed",
  },
} as const;

// ============================================================
// Generate page-specific metadata
// ============================================================

export interface SEOPageProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  path?: string;
  keywords?: string;
  noIndex?: boolean;
  publishedTime?: string;
  author?: string;
  type?: "website" | "article" | "product";
}

export function generatePageMeta({
  title,
  description,
  canonical,
  image,
  path = "",
  keywords,
  noIndex = false,
  publishedTime,
  author,
  type = "website",
}: SEOPageProps) {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImage = image || SITE_CONFIG.defaultImage;

  return {
    title: fullTitle,
    description,
    keywords:
      keywords ||
      [
        title,
        SITE_CONFIG.name,
        SITE_CONFIG.businessName,
        ...SITE_CONFIG.keywords.slice(0, 5),
      ].join(", "),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.siteName,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { article: { publishedTime } }),
      ...(author && { article: { authors: [author] } }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@inkofmemories",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: canonical || url,
    },
    other: {
      "geo.region": "IN-HR",
      "geo.placename": "Panchkula",
      "business:contact_data:street_address": SITE_CONFIG.address.street,
      "business:contact_data:locality": SITE_CONFIG.address.city,
      "business:contact_data:region": SITE_CONFIG.address.state,
      "business:contact_data:postal_code": SITE_CONFIG.address.pincode,
      "business:contact_data:country_name": SITE_CONFIG.address.country,
    },
  };
}

// ============================================================
// Organization JSON-LD Structured Data
// ============================================================

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    /*
      "PrintingBusiness" is NOT a valid schema.org type — it does not exist in
      the vocabulary, so Google silently discards the whole node. "LocalBusiness"
      is the correct supertype for a physical print shop and is what qualifies
      the business for local results / the knowledge panel. "Store" is appended
      because the catalogue is the point of the site; a multi-type array is valid
      and lets Google match the most specific one.
    */
    "@type": ["LocalBusiness", "Store"],
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.businessName,
    alternateName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    // Read from SITE_CONFIG rather than hard-coded, so the Organization logo and
    // the social/image logo can never drift apart.
    logo: SITE_CONFIG.logo,
    image: SITE_CONFIG.defaultImage,
    description: SITE_CONFIG.description,
    foundingDate: String(FOUNDED_YEAR),
    foundingLocation: "Panchkula, Haryana",
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer, Cards",
    /*
      Coordinates drive the "map pack" / local pack ranking. Keep them in sync
      with the physical press address in SITE_CONFIG.address.
    */
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.6938,
      longitude: 76.8509,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${SITE_CONFIG.name}, ${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state} ${SITE_CONFIG.address.pincode}`,
    )}`,
    areaServed: [
      { "@type": "City", name: "Panchkula" },
      { "@type": "City", name: "Chandigarh" },
      { "@type": "City", name: "Mohali" },
      { "@type": "Country", name: "India" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.pincode,
      addressCountry: SITE_CONFIG.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.contact.phone,
        contactType: "sales",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.contact.phone,
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
    ],
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      // Normalised to digits so wa.me receives a bare phone number.
      `https://wa.me/${SITE_CONFIG.social.whatsapp.replace(/[^0-9]/g, "")}`,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Wedding Card Printing" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Visiting Card Printing" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Brochure Printing" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Banner Printing" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Packaging Printing" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Custom Invitation Cards" },
      },
    ],
  };
}

// ============================================================
// Breadcrumb JSON-LD
// ============================================================

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

// ============================================================
// WebPage JSON-LD
// ============================================================

export function getWebPageSchema(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${SITE_CONFIG.url}${path}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  };
}

// ============================================================
// Product JSON-LD
// ============================================================

export function getProductSchema(product: {
  name: string;
  description: string;
  slug: string;
  image: string;
  price?: number;
  currency?: string;
  category?: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${SITE_CONFIG.url}/products/${product.slug}`,
    ...(product.category && {
      category: product.category,
    }),
    ...(product.brand && {
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
    }),
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: product.currency || "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/products/${product.slug}`,
      },
    }),
  };
}

// ============================================================
// FAQ JSON-LD
// ============================================================

export function getFAQSchema(
  questions: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

// ============================================================
// noindex metadata helper
// ============================================================

/**
 * Metadata for pages that must never appear in search results.
 *
 * Covers the per-visitor surfaces — cart, favourites, compare, profile, auth,
 * dashboards — whose content is either empty by default or unique to a logged-in
 * user. Indexing them produces thin/duplicate results and, for the cart, the
 * classic "soft 404" that degrades a site's perceived quality.
 *
 * `follow` stays true so crawlers can still traverse the links out of these
 * pages and discover the rest of the site.
 *
 * These routes are client components, so this is consumed from a server
 * `layout.tsx` per route — see app/cart/layout.tsx for the usage pattern.
 */
export function noIndexMetadata(
  title: string,
  path: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "none",
        "max-snippet": 0,
        "max-video-preview": -1,
      },
    },
    alternates: {
      // Self-referencing: a noindexed URL still wants a canonical so it is not
      // treated as a duplicate of an unrelated page.
      canonical: path,
    },
  };
}