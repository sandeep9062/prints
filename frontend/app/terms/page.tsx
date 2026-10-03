"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Scale,
  FileText,
  UserCheck,
  Globe,
  Building2,
  CreditCard,
  Copyright,
  Ban,
  Link2,
  ShieldCheck,
  UserX,
  Gavel,
  RefreshCw,
  Mail,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { LEGAL_NAME } from "@/lib/site-config";

interface TermsSection {
  icon: LucideIcon;
  title: string;
  content: string;
  items: string[];
  email?: string;
}

const TermsAndConditions = () => {
  const router = useRouter();

  const sections: TermsSection[] = [
    {
      icon: FileText,
      title: "1 — Acceptance of Terms",
      content:
        "These Terms & Conditions (these Terms) govern your access to and use of the Ink of Memories website and mobile experience (together, the Platform). By browsing, registering on, or placing a print order on the Platform, you confirm that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy, Refund Policy, and Disclaimer.",
      items: [
        "These Terms form a legally binding agreement between you and Ink of Memories.",
        "If you do not agree with any part of these Terms, please discontinue use of the Platform.",
        "You are responsible for ensuring that your use of the Platform complies with all applicable laws.",
      ],
    },
    {
      icon: UserCheck,
      title: "2 — Eligibility & Account Registration",
      content:
        "To create an account or place an order, you must be at least 18 years of age and legally capable of entering into binding contracts under the Indian Contract Act, 1872. You agree to provide true, accurate, current, and complete information at all times.",
      items: [
        "Keep your login credentials confidential — you are responsible for all activity carried out through your account.",
        "One account per person or business, unless we authorise otherwise in writing.",
        "Notify us immediately at info@inkofmemories.com of any unauthorised use of your account.",
        "We may verify your identity, contact details, or business documents (such as GSTIN or PAN) before enabling bulk or business orders.",
      ],
    },
    {
      icon: Globe,
      title: "3 — Use of the Platform",
      content:
        "Ink of Memories provides an online catalogue and ordering experience for custom printing — wedding cards, visiting cards, shagun envelopes, letter pads, brochures, banners, packaging and personalized gifts — every one of them fulfilled by our own press.",
      items: [
        "You may use the Platform for lawful, personal, or genuine business printing purposes.",
        "Automated access, scraping, crawling, or bulk data extraction without our prior written consent is prohibited.",
        "You must not attempt to bypass, disable, or interfere with the security or access-control features of the Platform.",
        "Product imagery and previews are provided for reference; the physical proof approved by you is the basis for production.",
      ],
    },
    {
      icon: Building2,
      title: "4 — Custom Orders, Artwork & Proofing",
      content:
        "Every custom order requires artwork or design content supplied by you. Ink of Memories acts as a printer and design facilitator, and is not a party to any arrangement between you and any third-party designer whose work you supply. All artwork is proofed with you on real paper before production.",
      items: [
        "You confirm that you hold the right to reproduce any text, image, logo, or design you submit.",
        "Artwork must be supplied in print-ready format (vector PDF, AI, EPS, or high-resolution TIFF/CMYK) unless our team converts it for you.",
        "We share a digital or physical proof for approval. Production begins only after your written approval of that proof.",
        "We may decline artwork that is unlawful, infringing, or technically unsuitable for offset, letterpress, or foil-stamping production.",
      ],
    },
    {
      icon: CreditCard,
      title: "5 — Pricing, Payments & Refunds",
      content:
        "All prices are shown on the Platform in Indian Rupees (₹) and are inclusive or exclusive of GST as indicated at checkout. Custom printing is a made-to-order service, and payments are processed through third-party payment gateways.",
      items: [
        "Prices are confirmed at the time of order and apply only to that order.",
        "Quantities, paper stock, GSM, finishing and delivery charges are confirmed in your quotation before production.",
        "Refunds, reprints, and cancellations are governed by our Refund Policy.",
        "We are not responsible for delays or failures caused by banking or payment-gateway systems.",
      ],
    },
    {
      icon: Copyright,
      title: "6 — Intellectual Property",
      content:
        "All content on the Platform — including the Ink of Memories name and logo, text, graphics, page design, software, original stationery designs, and curated product data — is owned by or licensed to Ink of Memories and is protected under applicable intellectual-property laws.",
      items: [
        "You receive a limited, revocable, non-exclusive licence to use the Platform for its intended purpose.",
        "You may not copy, reproduce, modify, distribute, or create derivative works of our original designs without our prior written consent.",
        "By uploading artwork, you grant us a non-exclusive, royalty-free licence to reproduce it solely for fulfilling your order.",
        "You confirm that your uploaded content does not infringe the rights of any third party, including the right to print photographs of people.",
      ],
    },
    {
      icon: Ban,
      title: "7 — Prohibited Activities",
      content:
        "To keep the Platform safe and trustworthy, the following activities are strictly prohibited.",
      items: [
        "Uploading artwork that is counterfeit, fraudulent, or infringes trademarks, copyrights, or the right to privacy of others.",
        "Publishing content that is defamatory, obscene, harassing, discriminatory, or otherwise unlawful.",
        "Impersonating Ink of Memories, its employees, or any other person or business.",
        "Misusing enquiry or contact forms to send spam, promotions, or unsolicited communication.",
        "Violating any applicable law, including the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020.",
      ],
    },
    {
      icon: Link2,
      title: "8 — Third-Party Links & Services",
      content:
        "The Platform may contain links to third-party websites, tools, or services (for example, payment gateways, courier partners, or design resources). Such links are provided for convenience only.",
      items: [
        "We do not control and are not responsible for the content, policies, or practices of third parties.",
        "Your dealings with any third party are solely between you and that party.",
      ],
    },
    {
      icon: Scale,
      title: "9 — Limitation of Liability",
      content:
        "Printing is a physical craft — colour, texture, and finish vary between screens, proofs, and press output. The approved physical proof is the reference standard.",
      items: [
        "We are not liable for indirect, incidental, special, or consequential losses, including lost profits or missed event dates.",
        "Colour reproduction on your monitor may differ from the physical print, particularly with metallic foils, textured stocks, and rich blacks.",
        "To the maximum extent permitted by law, our total aggregate liability shall not exceed the amount you paid for the specific order giving rise to the claim.",
        "Nothing in these Terms limits any liability that cannot be limited under applicable law.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "10 — Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless Ink of Memories, its directors, employees, and partners from and against any claims, losses, liabilities, damages, and expenses (including reasonable legal fees) arising out of or related to:",
      items: [
        "Your use of the Platform or breach of these Terms.",
        "Any artwork you upload, including claims that it infringes third-party rights.",
        "Any dispute between you and another customer or third party.",
      ],
    },
    {
      icon: UserX,
      title: "11 — Suspension & Termination",
      content:
        "We may restrict, suspend, or terminate your access to the Platform, or cancel an order, at our discretion and without prior notice, if we believe you have violated these Terms or applicable law.",
      items: [
        "You may stop using the Platform and request account deletion at any time.",
        "Where a print order has entered production, it can no longer be cancelled — this is set out in our Refund Policy.",
        "Provisions relating to intellectual property, liability, indemnification, and governing law survive termination.",
      ],
    },
    {
      icon: Gavel,
      title: "12 — Governing Law & Jurisdiction",
      content:
        "These Terms are governed by and construed in accordance with the laws of India. Subject to applicable law, the courts at Chandigarh shall have exclusive jurisdiction over any dispute arising out of or in connection with the Platform or these Terms.",
      items: [
        "Before pursuing legal action, both parties agree to attempt to resolve disputes amicably by writing to info@inkofmemories.com.",
      ],
    },
    {
      icon: RefreshCw,
      title: "13 — Changes to These Terms",
      content:
        "We may update these Terms from time to time to reflect changes in our services, technology, or legal requirements. The revised Terms will be posted on this page with an updated last-updated date.",
      items: [
        "Material changes will be notified through the Platform or by email where practicable.",
        "Your continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.",
      ],
    },
    {
      icon: Mail,
      title: "14 — Contact & Grievance Redressal",
      content:
        "If you have questions, concerns, or complaints about your print order or these Terms, please reach out to our Grievance Officer. We aim to respond to every print-quality complaint within 7 working days of receiving the photographs you share:",
      items: [],
      email: "info@inkofmemories.com",
    },
  ];

  return (
    <main className="relative min-h-screen bg-card">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-r to-brand-hover from-muted to-brand-soft pt-30 py-20 text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Scale size={400} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-4">
              <FileText size={18} />
              Legal Agreement
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Terms & Conditions
            </h1>
            <p className="text-foreground text-lg leading-relaxed">
              Welcome to <strong>Ink of Memories</strong>, the online identity of our
              Panchkula press. These Terms & Conditions set out the
              rules for ordering custom printing and stationery through the
              Platform. Please read them carefully before placing a print
              order.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LAST UPDATED */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-sm mt-6 mb-2">
            Last updated: September 28, 2026
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* INTRO BOX */}
            <div className="bg-ivory border-l-4 border-foreground p-6 mb-12 rounded-r-xl shadow-sm">
              <div className="flex gap-4">
                <Info className="text-foreground shrink-0" />
                <p className="text-foreground text-sm md:text-base italic">
                  By using Ink of Memories, you agree to these Terms &
                  Conditions. They work alongside our Privacy Policy, Refund
                  Policy, and Disclaimer, so please review all of them together
                  before placing an order.
                </p>
              </div>
            </div>

            {/* SECTIONS */}
            <div className="space-y-14">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground shrink-0 group-hover:bg-footer group-hover:text-footer-foreground transition-all duration-300">
                      <section.icon size={22} />
                    </span>
                    <div className="flex-1">
                      <h2 className="font-sans text-xl font-semibold text-foreground mb-3 group-hover:text-foreground transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-3">
                        {section.content}
                      </p>

                      {section.items.length > 0 && (
                        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-muted-foreground text-base md:text-lg">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {section.email && (
                        <p className="text-foreground font-semibold text-base md:text-lg mt-2">
                          Email:{" "}
                          <span className="text-foreground">{section.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RELATED POLICIES */}
            <div className="mt-16 bg-muted rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-sans text-lg font-semibold text-foreground mb-4">
                Related Policies
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  ["Privacy Policy", "/privacy-policy"],
                  ["Refund Policy", "/refund"],
                  ["Disclaimer", "/disclaimer"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:bg-footer hover:text-footer-foreground transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-20 pt-10 border-t border-border text-center">
              <p className="text-muted-foreground text-sm">
                Last Updated: September 2026 • © {new Date().getFullYear()}{" "}
                {LEGAL_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HELP CALLOUT */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-footer rounded-2xl p-8 md:p-12 text-footer-foreground flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-semibold mb-2">
                Need clarification on our Terms?
              </h2>
              <p className="text-muted-foreground opacity-90">
                Our team is happy to help you understand your rights and
                responsibilities when ordering from Ink of Memories.
              </p>
            </div>
            <button
              onClick={() => router.push("/contact")}
              className="bg-card text-foreground px-8 py-4 rounded-xl font-bold hover:bg-ivory transition-all whitespace-nowrap shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;
