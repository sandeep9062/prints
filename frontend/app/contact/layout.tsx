import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/seo";

/*
  Server-rendered metadata for /contact.

  /contact is the primary local-SEO surface for the business (NAP — name,
  address, phone — is what local ranking depends on), but the page is a client
  component and previously only got its title/description/canonical from
  <SEOHelper>'s useEffect. Anything that doesn't execute JS therefore saw the
  root-layout defaults and the homepage's canonical URL.

  Declaring metadata in this server layout makes it part of the SSR HTML.
*/

const TITLE = "Contact Us – Ink of Memories, Panchkula";
const DESCRIPTION =
  "Get in touch with Ink of Memories. Call, email, or visit us in Panchkula for premium wedding cards, visiting cards, brochures & custom printing.";
const PATH = "/contact";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "contact printing press",
    "Ink of Memories contact",
    "Panchkula printing press",
    "custom printing inquiry",
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
        alt: `Contact ${SITE_CONFIG.name} — printing press in ${SITE_CONFIG.address.city}`,
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

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}