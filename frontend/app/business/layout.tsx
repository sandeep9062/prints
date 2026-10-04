import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";

/*
  Server-rendered metadata for /business.

  The page is a client component and previously relied on <SEOHelper> for its
  title/description/canonical, which only existed after hydration. This layout
  puts them in the SSR HTML, following the pattern used by app/blog and
  app/terms.
*/

const TITLE = "B2B Printing Partner – Ink of Memories for Businesses";
const DESCRIPTION =
  "Partner with Ink of Memories for B2B packaging and printing solutions. Ribbon-handle bags, rigid boxes, gold foil branding & more. Direct from press in Panchkula.";
const PATH = "/business";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "B2B printing partner",
    "business packaging",
    "retail packaging Panchkula",
    "custom packaging India",
    "bulk printing",
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
        alt: `B2B printing and packaging by ${SITE_CONFIG.name}`,
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

export default function BusinessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}