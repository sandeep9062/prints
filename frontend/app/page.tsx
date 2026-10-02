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
import { SEOHelper } from "@/components/SEOHelper";
import {
  SITE_CONFIG,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";

export default function Home() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", url: "/" }]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Premium Printing Services – Wedding Cards, Visiting Cards & More"
        description={SITE_CONFIG.description}
        path="/"
        image={SITE_CONFIG.defaultImage}
        keywords="printing press, wedding cards, visiting cards, brochure printing, Panchkula printing, Chandigarh printing"
        jsonLd={[orgSchema, breadcrumbSchema]}
      />
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
      </main>
    </div>
  );
}
