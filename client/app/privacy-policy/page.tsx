"use client";

import { FC } from "react";
import {
  ShieldCheck,
  Database,
  FileLock,
  CreditCard,
  Share2,
  Cookie,
  LockKeyhole,
  Eye,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

interface PolicySection {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you place an order or contact us, we may collect the following
          information:
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 text-muted-foreground">
          {[
            "Full Name",
            "Phone Number",
            "Email Address",
            "Shipping & Billing Address",
            "Uploaded Designs & Custom Content",
            "Payment info (Handled securely)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "2. How We Use Your Information",
    content: (
      <ul className="space-y-2 text-muted-foreground">
        {[
          "To process and complete your printing orders",
          "To send order updates & confirmations",
          "To improve customer experience",
          "To resolve queries and support requests",
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
    icon: FileLock,
    title: "3. Design & File Confidentiality",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Every document, design, image, and content shared by you is kept
        strictly confidential. We never reuse, distribute, or sell your custom
        files &mdash; your designs remain entirely yours.
      </p>
    ),
  },
  {
    icon: CreditCard,
    title: "4. Secure Payments",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We do not store any card or UPI details on our servers. All transactions
        are processed using trusted and secure third-party payment gateways with
        end-to-end encryption.
      </p>
    ),
  },
  {
    icon: Share2,
    title: "5. Information Sharing",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Your information is shared only when absolutely required:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          {[
            "With delivery partners to fulfill your orders",
            "With legal authorities when required by law",
            "With trusted partners who help in providing services",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: Cookie,
    title: "6. Cookies & Analytics",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We use cookies and analytics to understand visitor behaviour and enhance
        your browsing experience. These cookies never store personal or
        sensitive data.
      </p>
    ),
  },
  {
    icon: LockKeyhole,
    title: "7. Data Protection",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We use strong technical and organizational security measures to protect
        your information from unauthorized access or disclosure.
      </p>
    ),
  },
  {
    icon: Eye,
    title: "8. Your Rights",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        You may request to view, edit, or delete your data at any time by
        contacting us. We respect your rights and data ownership.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "9. Updates to this Policy",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We may update this privacy policy in the future. Any changes will be
        reflected on this page with the updated date.
      </p>
    ),
  },
];

const PrivacyPolicyPage: FC = () => {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Privacy Policy – Ink of Memories | Samlason Printing Press"
        description="Read the privacy policy of Samlason Printing Press. Learn how we collect, use, and protect your personal information and uploaded designs."
        path="/privacy-policy"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="privacy policy, data protection, Ink of Memories privacy, Samlason Printing privacy"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16 bg-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We value your trust. This Privacy Policy describes how your
                personal information is collected, used, and protected when you
                use our printing services.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {policySections.map((section) => (
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

export default PrivacyPolicyPage;
