import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";

/*
  Server-rendered metadata for /customize.

  /customize is a real landing page ("design your wedding invitation online"),
  not a utility screen, so it should be indexed. The page is a client component
  and previously got its metadata only from <SEOHelper> after hydration; this
  layout makes the title/description/canonical available in the SSR HTML.
*/

const TITLE = "Design Wedding Invitation Cards Online | Ink of Memories";
const DESCRIPTION =
  "Design your own wedding invitation card online. Choose fonts, colors, borders, and templates. Premium quality printing by Ink of Memories, Panchkula.";
const PATH = "/customize";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "customize wedding invitation",
    "design invitation online",
    "wedding card designer",
    "custom invitation card",
    "personalized wedding cards",
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
        alt: "Design your own wedding invitation card online with Ink of Memories",
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

export default function CustomizeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}