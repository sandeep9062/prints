"use client";

import { FC } from "react";
import {
  Shield,
  FileText,
  CreditCard,
  XCircle,
  Truck,
  RotateCcw,
  FileWarning,
  Copyright,
  Lock,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

interface TermSection {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

const termSections: TermSection[] = [
  {
    icon: FileText,
    title: "1. About Our Printing Services",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We provide professional printing and design services including Visiting
        Cards, Wedding Cards, Invitation Cards, Brochures, Banners, Stickers,
        Bill Books, Letterheads, Rubber Stamps, Calendars, Books, and customized
        gift items. By placing an order, you agree to follow these terms.
      </p>
    ),
  },
  {
    icon: Shield,
    title: "2. Order Confirmation & Approval",
    content: (
      <ul className="space-y-2 text-muted-foreground">
        {[
          "Orders are confirmed only after final design approval.",
          "Approved designs cannot be modified without additional charges.",
          "Any errors must be corrected before approval.",
          "We are not responsible for mistakes after approval.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: CreditCard,
    title: "3. Pricing & Payment",
    content: (
      <ul className="space-y-2 text-muted-foreground">
        {[
          "All prices are in INR (₹).",
          "Payment is required before production begins.",
          "Costs depend on size, paper, finish & quantity.",
          "Extra services like embossing, lamination may cost extra.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: XCircle,
    title: "4. Order Cancellation",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Orders can only be cancelled before printing begins. Once the job is
        printed, it cannot be cancelled or refunded.
      </p>
    ),
  },
  {
    icon: Truck,
    title: "5. Delivery & Turnaround",
    content: (
      <ul className="space-y-2 text-muted-foreground">
        {[
          "Timelines are estimated and not guaranteed.",
          "Delays due to external circumstances are not our responsibility.",
          "Express services may cost extra.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: RotateCcw,
    title: "6. Reprints & Returns",
    content: (
      <ul className="space-y-2 text-muted-foreground">
        {[
          "Reprints only if final product differs from approved design.",
          "Color variations are normal from screen to print.",
          "Customized products are non-refundable.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: FileWarning,
    title: "7. Customer File Responsibility",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Customer-provided files should be high resolution. We are not
        responsible for poor print quality if the file itself is of low quality.
      </p>
    ),
  },
  {
    icon: Copyright,
    title: "8. Copyright & Usage",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        You must own rights to all content you provide. We will not be
        responsible for any copyright issues caused by submitted content.
      </p>
    ),
  },
  {
    icon: Lock,
    title: "9. Privacy & Data Usage",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Your personal details will be used only for order processing and
        delivery and will never be shared or sold without your consent.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "10. Policy Updates",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We may update our terms at any time. Changes will be reflected on this
        page immediately.
      </p>
    ),
  },
];

const TermsPage: FC = () => {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms & Conditions", url: "/terms" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Terms & Conditions – Ink of Memories | Samlason Printing Press"
        description="Read the terms and conditions of Samlason Printing Press. Order policies, payment terms, delivery information, and reprint/return policies."
        path="/terms"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="terms and conditions, printing terms, Samlason Printing terms, order policy, refund policy"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16 bg-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Please read these terms carefully. By placing an order with our
                printing company, you agree to the conditions below.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {termSections.map((section) => (
                <div key={section.title} className="card-elegant p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-xl font-semibold mb-3">
                        {section.title}
                      </h2>
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsPage;
