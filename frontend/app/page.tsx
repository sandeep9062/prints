import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";
import OfferStrip from "@/components/home/OfferStrip";
import ServiceSection from "@/components/home/ServiceSection";
import Atelier from "@/components/home/Atelier";
import type { Metadata } from "next";
import {
  SITE_CONFIG,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";
import QuickLinks from "@/components/QuickLinks";
import { JsonLd } from "@/components/JsonLd";

const HOME_TITLE = "Premium Printing & Design Services in Panchkula";

/*
  Server-rendered metadata for the homepage.

  This used to be applied by the client-side <SEOHelper>, which injected the
  title/description/canonical/OG/JSON-LD from a useEffect. Crawlers and social
  scrapers (Facebook, WhatsApp, Slack, X) that never execute JS therefore saw
  only the root-layout defaults — every un-migrated page shared the homepage's
  title and rendered no link preview. Exporting `metadata` puts it in the SSR
  HTML, which is what gets indexed and unfurled.

  <SEOHelper> is kept below purely for its JSON-LD, so the structured data is
  still emitted for the hydrated client.
*/
export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_CONFIG.description,
  keywords: [
    "printing press",
    "wedding cards",
    "visiting cards",
    "brochure printing",
    "Panchkula printing",
    "Chandigarh printing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.siteName,
    title: HOME_TITLE,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} – Premium Printing & Design Services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultImage],
    creator: "@inkofmemories",
  },
};

export default function Home() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", url: "/" }]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd items={[orgSchema, breadcrumbSchema]} />
      <main>
        <HeroSection />
        <OfferStrip />
        {/* <ServiceSection/> */}
        <CategoriesSection />

        <FeaturedProducts />
        <AboutSection />

        <TestimonialsSection />
        <Atelier />
        <CTASection />

        <QuickLinks />
      </main>
    </div>
  );
}
