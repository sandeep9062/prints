"use client";

import {
  MoveRight,
  Package,
  ShieldCheck,
  Zap,
  Factory,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

export default function BusinessPage() {
  const features = [
    {
      icon: Factory,
      title: "Direct From Press",
      description:
        "No middlemen. We manufacture locally at Samlason Press, ensuring 100% quality control and faster lead times.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Precision",
      description:
        "From 600gsm cotton paper to 24k gold foil, we use only premium materials that reflect your brand's value.",
    },
    {
      icon: Zap,
      title: "Tech-Led Fulfillment",
      description:
        "Manage re-orders, view digital 3D proofs, and track inventory via our bespoke MERN-stack partner portal.",
    },
  ];

  const products = [
    {
      title: "Ribbon-Handle Bags",
      description:
        "Premium 250gsm art paper with custom-dyed silk ribbons and gold foil branding.",
      image: "/placeholder.svg",
    },
    {
      title: "Branding Boxes",
      description:
        "Rigid magnetic closure boxes with velvet-flocked interiors for jewelry and watches.",
      image: "/placeholder.svg",
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Business / B2B", url: "/business" },
  ]);

  // B2B Service JSON-LD Schema
  const b2bServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "B2B Printing & Packaging Solutions",
    description:
      "Partner with Samlason Printing Press for B2B packaging and printing solutions. Ribbon-handle bags, rigid boxes, gold foil branding, custom packaging for retail businesses.",
    provider: {
      "@type": "PrintingBusiness",
      name: "Samlason Printing Press",
      url: "https://inkofmemories.com",
    },
    areaServed: [
      { "@type": "City", name: "Panchkula" },
      { "@type": "City", name: "Chandigarh" },
      { "@type": "City", name: "Mohali" },
      { "@type": "Country", name: "India" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "B2B Printing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ribbon-Handle Bags",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Branding Boxes",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Packaging Design",
          },
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="B2B Printing Partner – Samlason Printing Press for Businesses"
        description="Partner with Samlason Printing Press for B2B packaging and printing solutions. Ribbon-handle bags, rigid boxes, gold foil branding & more. Direct from press in Panchkula."
        path="/business"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="B2B printing partner, business packaging, retail packaging Panchkula, custom packaging India, bulk printing, Samlason printing business"
        jsonLd={[breadcrumbSchema, b2bServiceSchema]}
      />
      <main className="pt-24 pb-16">
        {/* 1. Hero Section */}
        <section className="py-16 bg-hero">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  B2B Partner Program
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mt-4 mb-6 leading-tight">
                  Packaging that acts as your{" "}
                  <span className="italic text-primary">Silent Salesman.</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Elevate your retail brand with 24k gold-foiled bags and rigid
                  boxes. Hand-pressed in Panchkula, engineered for high-end
                  boutique experiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="gold" size="lg" className="min-w-[200px]">
                    Request Sample Trunk
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Download Catalog <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/50" />
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/90 backdrop-blur-sm rounded-lg">
                  <p className="text-sm font-medium text-primary tracking-wider uppercase">
                    Manufactured at
                  </p>
                  <p className="font-display text-xl font-semibold mt-1">
                    Samlason Printing Press
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The Samlason Edge (Stats Bar) */}
        <section className="py-16 bg-red-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-primary-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. B2B Product Focus */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  Crafting Excellence
                </span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-4">
                  Artisan Packaging for <br /> Premier Retailers
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.title}
                  className="group card-elegant overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10" />
                    <div className="absolute inset-0 bg-secondary group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <h4 className="font-display text-2xl font-semibold mb-2">
                      {product.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                    <Button
                      variant="link"
                      className="mt-4 p-0 text-primary hover:text-primary/80"
                    >
                      Learn more <MoveRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Quality Assurance */}
        <section className="py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  Why Partner With Us
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 mb-8">
                  Quality You Can Trust, <br />
                  <span className="text-primary">Every Single Time</span>
                </h2>
                <div className="space-y-6">
                  {[
                    "In-house manufacturing with strict quality control",
                    "Premium materials sourced from trusted suppliers",
                    "On-time delivery guaranteed with real-time tracking",
                    "Dedicated account manager for every B2B partner",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/50" />
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 pattern-geometric" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Sample Trunk Lead Magnet */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="card-elegant p-8 md:p-12">
                <div className="text-center mb-8">
                  <span className="text-sm font-medium text-primary tracking-wider uppercase">
                    Get Started
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 mb-4">
                    See the Quality First.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    High-end retail is tactile. Request our physical "Sample
                    Trunk" containing our latest ribbon bags, rigid boxes, and
                    foil swatches delivered to your showroom in Chandigarh or
                    Panchkula.
                  </p>
                </div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Business Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your business name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        WhatsApp Number
                      </label>
                      <Input
                        type="text"
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Business Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@business.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Tell us about your packaging needs..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                  >
                    Request Free Sample Trunk
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
