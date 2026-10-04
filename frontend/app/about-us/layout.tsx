import type { Metadata } from "next";

import { FOUNDED_YEAR, yearsInBusiness } from "@/lib/site-config";
import { SITE_CONFIG } from "@/lib/seo";

/*
  Server-rendered metadata for /about-us.

  The page component itself is a client component, so it cannot export
  `metadata`. Previously it relied on the client-side <SEOHelper>, which meant
  the SSR HTML carried the generic root-layout title and the homepage's
  canonical — crawlers and link-preview scrapers that don't run JS saw
  duplicate titles across the site and wrong canonicals.

  Declaring metadata in this server layout fixes both, and follows the same
  pattern already used by app/blog, app/terms and app/privacy-policy.
*/

const years = yearsInBusiness();
// The founding year is deliberately NOT in the title: with the brand suffix it
// pushes the title to 62+ characters, where Google truncates mid-suffix. It
// stays in the description and the JSON-LD instead, where it costs nothing.
const TITLE = "About Us – Our Printing Press in Panchkula";
const DESCRIPTION = `Learn about Ink of Memories – over ${years} years of premium printing excellence in Panchkula. Wedding cards, visiting cards, brochures & more with quality craftsmanship.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "about printing press",
    "Ink of Memories",
    "wedding card printing press",
    "visiting card",
    "best printing press in Panchkula",
    "best wedding card printing press in Panchkula",
    "Panchkula printing history",
    `${FOUNDED_YEAR} printing`,
    "premium printing India",
  ],
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_CONFIG.url}/about-us`,
    siteName: SITE_CONFIG.siteName,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: `About ${SITE_CONFIG.name} — a printing press in Panchkula since ${FOUNDED_YEAR}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_CONFIG.defaultImage],
    creator: "@inkofmemories",
  },
};

export default function AboutUsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
