import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";

/*
  Server-rendered metadata for /become-a-merchant.

  The page is a client component (interactive application form + accordions),
  so its title/description/canonical would otherwise only appear after
  hydration via <SEOHelper>'s useEffect. Declaring them here puts them in the
  SSR HTML, following app/business and app/contact.

  This route is intentionally INDEXABLE — it is a genuine acquisition page
  ("sell on Ink of Memories") and should rank, unlike the per-visitor
  dashboards which use noIndexMetadata().
*/

const TITLE = "Become a Merchant – Sell Your Prints on Ink of Memories";
const DESCRIPTION =
  "Join Ink of Memories as a merchant. List wedding cards, visiting cards, packaging & more, manage orders and inventory from a free dashboard, and reach customers across Panchkula & Chandigarh. No listing fee.";
const PATH = "/become-a-merchant";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "become a merchant",
    "sell printing online",
    "Ink of Memories merchant",
    "start online print shop",
    "list products marketplace India",
    "wedding card reseller",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_CONFIG.url}${PATH}`,
    siteName: SITE_CONFIG.siteName,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: `Become a merchant on ${SITE_CONFIG.name}`,
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

export default function BecomeAMerchantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}