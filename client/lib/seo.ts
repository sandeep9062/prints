// ============================================================
// SEO Constants & Configuration for Ink of Memories
// ============================================================

export const SITE_CONFIG = {
  name: "Ink of Memories",
  businessName: "Samlason Printing Press",
  tagline: "Premium Printing & Design Services",
  fullName: "Ink of Memories | Premium Printing",
  description:
    "Premium printing services from Samlason Printing Press since 2004. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts. Custom printing with hand-pressed quality in Panchkula.",
  shortDescription:
    "Premium printing services for weddings, business & personal needs. Custom invitation cards, visiting cards & packaging.",
  url: "https://inkofmemories.com",
  defaultImage: "https://inkofmemories.com/inkofmemories.png",
  logo: "https://inkofmemories.com/inkofmemories.png",
  favicon: "/favicon.ico",
  locale: "en_IN",
  language: "en",
  siteName: "Ink of Memories",
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
    "Samlason Printing",
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
    "@type": "PrintingBusiness",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.businessName,
    alternateName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/inkofmemories.png`,
    image: SITE_CONFIG.defaultImage,
    description: SITE_CONFIG.description,
    foundingDate: "2004",
    foundingLocation: "Panchkula, Haryana",
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
