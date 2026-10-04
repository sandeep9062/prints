"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  BadgePercent,
  BarChart3,
  Boxes,
  CheckCircle2,
  Handshake,
  IndianRupee,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/editorial/PageHeader";
import { TextAreaField, TextField } from "@/components/editorial/Field";
import { SEOHelper } from "@/components/SEOHelper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";
import { selectIsAuthenticated } from "@/store/authSlice";

/* ══════════════════════════════════════
   CONTENT
   ------------------------------------------------------------
   Every capability named here is one the
   existing /merchant-dashboard actually
   ships (products, orders, customers,
   stock, analytics, settings) — the page
   must not promise a feature the dashboard
   doesn't have.
   ══════════════════════════════════════ */

interface Perk {
  icon: LucideIcon;
  title: string;
  description: string;
}

const perks: Perk[] = [
  {
    icon: Store,
    title: "Your Own Storefront",
    description:
      "List every design you print under one shop. Your products, pricing and descriptions are yours to manage — edit or remove them any time.",
  },
  {
    icon: Boxes,
    title: "Orders & Inventory Together",
    description:
      "Every order lands in one dashboard alongside live stock counts. Adjust quantity inline and low-stock items surface before they run out.",
  },
  {
    icon: BarChart3,
    title: "See What Actually Sells",
    description:
      "Units sold, revenue and a monthly trend chart — so you reprint the winners instead of guessing which designs to keep in stock.",
  },
  {
    icon: IndianRupee,
    title: "Keep More of Each Sale",
    description:
      "No listing fee and no monthly charge to run your shop. You set your own prices and keep the margin on every order.",
  },
  {
    icon: Truck,
    title: "We Handle Production",
    description:
      "You never touch a press. Orders are proofed, printed and finished in-house at Panchkula and dispatched to the customer for you.",
  },
  {
    icon: ShieldCheck,
    title: "A Trusted Name Attached",
    description:
      "Your shop is listed under a four-decade-old press. Customers see a verified Ink of Memories merchant, not an unknown seller.",
  },
];

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Handshake,
    title: "Send the form",
    description:
      "Tell us who you are and what you print. It takes about two minutes — no documents needed at this stage.",
  },
  {
    icon: MessageCircle,
    title: "We call you",
    description:
      "A member of the team gets in touch to understand your catalogue, pricing and the volume you're starting with.",
  },
  {
    icon: Package,
    title: "Get approved",
    description:
      "Once we're aligned, your account is approved and you can sign in to the merchant dashboard to start listing.",
  },
  {
    icon: Sparkles,
    title: "List and sell",
    description:
      "Add your products, set prices and stock, and start taking orders from customers across the region.",
  },
];
const faqs = [
  {
    question: "Is there a fee to become a merchant?",
    answer:
      "There is no listing fee and no monthly charge to run your shop. You keep the margin on everything you sell, and pricing is entirely yours to set.",
  },
  {
    question: "Do I need to own a printing press?",
    answer:
      "No. If you print in-house you can list your own designs, and if you don't, we produce the order at our Panchkula press. Either way you never handle the printing yourself.",
  },
  {
    question: "What can I sell on Ink of Memories?",
    answer:
      "Wedding and invitation cards, visiting cards, shagun envelopes, letter pads, brochures and catalogs, banners and flex, books and bindings, stickers and rubber stamps — anything the press can produce.",
  },
  {
    question: "How do orders and payments work?",
    answer:
      "Orders arrive in your merchant dashboard where you can confirm and track them. Production, proofing and dispatch are handled by us, and payouts are settled as per the terms agreed during onboarding.",
  },
  {
    question: "I already sell elsewhere. Can I bring my catalogue?",
    answer:
      "Yes. Mention your existing catalogue or an Excel sheet of your designs in the message field and we'll map it across during onboarding.",
  },
  {
    question: "How long does approval take?",
    answer:
      "It depends on how quickly we can get on a call with you. Most applications are approved within a few working days of the call.",
  },
];

/* ══════════════════════════════════════
   FORM SUBMISSION
   ------------------------------------------------------------
   Posts to the same public enquiry endpoint
   the print-enquiry form uses
   (`POST {NEXT_PUBLIC_API_URL}/v1/enquiry`),
   which stores name / email / phone /
   message.

   The merchant-specific fields (shop name,
   GSTIN, catalogue) are folded into
   `message` so the onboarding team still
   receives the whole application in one
   place, exactly as /other-services/register
   does.

   A plain `fetch` rather than an RTK Query
   slice: this is a standalone public form
   with no reads and nothing to invalidate.
   ══════════════════════════════════════ */

const ENQUIRY_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/v1/enquiry`;

function buildApplicationMessage(fields: {
  shopName: string;
  city: string;
  gstin: string;
  categories: string[];
  catalogueUrl: string;
  note: string;
}): string {
  const lines: string[] = ["Merchant application from the website:", ""];

  if (fields.shopName) lines.push(`Shop / brand name: ${fields.shopName}`);
  if (fields.city) lines.push(`City: ${fields.city}`);
  if (fields.gstin) lines.push(`GSTIN: ${fields.gstin}`);
  if (fields.categories.length) {
    lines.push(`Categories to sell: ${fields.categories.join(", ")}`);
  }
  if (fields.catalogueUrl) lines.push(`Catalogue link: ${fields.catalogueUrl}`);
  if (fields.note) lines.push(`Notes: ${fields.note}`);

  return lines.join("\n");
}

async function submitApplication(body: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // Surface the server's own message when it sends one, otherwise a generic line.
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") detail = data.message;
      else if (data && typeof data.error === "string") detail = data.error;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new Error(detail);
  }
}

/* Category options — mirrors the public print taxonomy so a merchant picks the
   same vocabulary a customer would search under. */
const CATEGORIES = [
  "Wedding Cards",
  "Invitation Cards",
  "Visiting Cards",
  "Shagun Envelopes",
  "Letter Pads",
  "Brochures & Catalogs",
  "Banners & Flex",
  "Books & Bindings",
  "Stickers",
  "Rubber Stamps",
];

const CITY_OPTIONS = [
  "Chandigarh",
  "Panchkula",
  "Mohali",
  "Zirakpur",
  "New Chandigarh",
  "Manimajra",
  "Derabassi",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  shopName: string;
  city: string;
  gstin: string;
  categories: string[];
  catalogueUrl: string;
  note: string;
  agreeTerms: boolean;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  shopName: "",
  city: "",
  gstin: "",
  categories: [],
  catalogueUrl: "",
  note: "",
  agreeTerms: false,
};

/* Reusable chip toggle for the category multi-select. */
function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-150 ${
        active
          ? "border-brand bg-brand text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

/* Brand tile icon used on the perk grid. */
function TileIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-primary-foreground">
      {children}
    </span>
  );
}
/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */

export default function BecomeAMerchantPage() {
  const { whatsAppNo } = useSiteSettings();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.categories.length === 0) {
      setError("Select at least one category you print or sell.");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please accept the Terms to send your application.");
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: buildApplicationMessage({
          shopName: form.shopName,
          city: form.city,
          gstin: form.gstin,
          categories: form.categories,
          catalogueUrl: form.catalogueUrl,
          note: form.note,
        }),
      });
      setSubmitted(true);
      setForm(initialState);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const clean = (whatsAppNo || "919876543210").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${clean}`, "_blank");
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHelper
          title="Application Received – Become a Merchant | Ink of Memories"
          description="Your merchant application has reached the Ink of Memories team. We'll call you shortly to discuss your catalogue and pricing."
          path="/become-a-merchant"
          jsonLd={[
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Become a Merchant", url: "/become-a-merchant" },
            ]),
            getFAQSchema(faqs),
          ]}
        />

        <main className="pt-[calc(var(--navbar-height)+3rem)] pb-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl border border-border bg-card px-8 py-16 text-center md:px-12">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
              </span>

              <h1 className="mt-8 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
                Application{" "}
                <em className="font-medium text-brand">received</em>
              </h1>

              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.8] text-muted-foreground">
                Thank you for applying to sell with Ink of Memories. A member of
                our merchant team will call you shortly to discuss your catalogue,
                pricing and the volume you&apos;re starting with.
              </p>

              <p className="mt-4 text-[13px] text-muted-foreground">
                Need it sooner? Message us on WhatsApp and we&apos;ll pick it up
                today.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#25D366] px-7 py-3 text-[13px] font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </button>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-footer px-7 py-3 text-[13px] font-semibold text-footer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Browse the catalogue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Become a Merchant – Sell Your Prints on Ink of Memories"
        description="Join Ink of Memories as a merchant. List wedding cards, visiting cards, packaging & more, manage orders and inventory from a free dashboard, and reach customers across Panchkula & Chandigarh. No listing fee."
        path="/become-a-merchant"
        keywords="become a merchant, sell printing online, Ink of Memories merchant, start online print shop, list products marketplace India"
        jsonLd={[
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Become a Merchant", url: "/become-a-merchant" },
          ]),
          getFAQSchema(faqs),
        ]}
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)] pb-24">
        <div className="container mx-auto px-6">
          {/* ───────── Page header ───────── */}
          <section className="pb-16">
            <PageHeader
              eyebrow="Partner With Us — Panchkula"
              title="Sell Your Prints,"
              accent="Grow With Us"
              description="Ink of Memories is more than a printing press — it's a marketplace where customers look for wedding cards, visiting cards, packaging and custom printing. List what you make, and we handle the pressing, proofing and delivery."
            >
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-footer px-8 py-3 text-[13px] font-semibold text-footer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </a>

                {/* Signed-in merchants already have a dashboard — send them there
                    instead of asking them to apply again. */}
                {isAuthenticated ? (
                  <Link
                    href="/merchant-dashboard"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-8 py-3 text-[13px] font-semibold text-foreground transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Go to your dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-8 py-3 text-[13px] font-semibold text-foreground transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Already a merchant? Log in
                  </Link>
                )}
              </div>
            </PageHeader>
          </section>

          {/* ───────── Perks ───────── */}
          <section className="py-16">
            <div className="mb-14 max-w-2xl">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-gold" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Why Sell With Us
                </span>
              </div>
              <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                Everything you need,
                <br />
                already built in
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {perks.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-card p-8 transition-colors hover:bg-brand-soft dark:hover:bg-muted"
                >
                  <TileIcon>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </TileIcon>
                  <h3 className="mt-6 text-[17px] font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.75] text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
{/* ───────── Zero-fee strip ───────── */}
          <section className="bg-footer py-14 text-footer-foreground">
            <div className="container mx-auto px-6">
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    icon: BadgePercent,
                    title: "No Listing Fee",
                    text: "Opening a shop and listing your first product costs nothing.",
                  },
                  {
                    icon: Sparkles,
                    title: "No Monthly Charge",
                    text: "There's no subscription to keep the store open — list only what you want to sell.",
                  },
                  {
                    icon: IndianRupee,
                    title: "Your Margin Stays Yours",
                    text: "Set your own prices. We never take a cut of what you earn per sale.",
                  },
                ].map(({ icon: Icon, title, text }, i) => (
                  <div
                    key={title}
                    className={
                      i > 0
                        ? "border-t border-footer-foreground/15 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0"
                        : undefined
                    }
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-footer-foreground/20 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-footer-muted">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───────── How it works ───────── */}
          <section className="py-20">
            <div className="mb-14 max-w-2xl">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-gold" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Getting Started
                </span>
              </div>
              <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                From application to first order in
                <em className="font-medium text-brand"> four steps</em>
              </h2>
            </div>

            <ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, description }, i) => (
                <li key={title} className="bg-card p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-soft text-brand dark:bg-brand/15">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-serif text-3xl tabular-nums text-border">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[17px] font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.75] text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
{/* ───────── Application form ───────── */}
          <section id="apply" className="scroll-mt-32 py-8">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              {/* Left: context + reassurance */}
              <div>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-10 bg-gold" />
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Merchant Application
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                  Start selling
                  <em className="font-medium text-brand"> this week</em>
                </h2>

                <p className="mt-6 text-[15px] leading-[1.8] text-muted-foreground">
                  Fill in the form and our merchant team will call you to
                  understand what you print. There&apos;s no fee, no commission
                  and no lock-in — if it&apos;s a good fit, you&apos;ll be selling
                  within days.
                </p>

                <ul className="mt-10 space-y-4">
                  {[
                    "Takes about two minutes",
                    "No documents required to apply",
                    "No listing fee, ever",
                    "Approval within a few working days",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      />
                      <span className="text-[14.5px] text-muted-foreground">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* WhatsApp alternative */}
                <div className="mt-12 border border-border bg-ivory p-8 dark:border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    Prefer to talk first?
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground">
                    Message us on WhatsApp and we&apos;ll walk you through the
                    process.
                  </p>
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#25D366] px-7 py-3 text-[13px] font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
{/* Right: the form */}
              <div className="border border-border bg-card p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-serif text-2xl tracking-tight text-foreground">
                    Tell us about your shop
                  </h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField
                      label="Your Name"
                      name="name"
                      placeholder="Full name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      required
                    />
                  </div>

                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@business.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField
                      label="Shop / Brand Name"
                      name="shopName"
                      placeholder="e.g. Verma Prints"
                      value={form.shopName}
                      onChange={(e) => update("shopName", e.target.value)}
                    />
                    <div>
                      <label
                        htmlFor="merchant-city"
                        className="block text-[10px] font-semibold text-muted-foreground"
                      >
                        City
                      </label>
                      <select
                        id="merchant-city"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="mt-2 w-full appearance-none rounded-none border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none transition-colors duration-200 focus:border-brand focus:ring-1 focus:ring-brand"
                      >
                        <option value="">Select a city</option>
                        {CITY_OPTIONS.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <TextField
                    label="GSTIN (optional)"
                    name="gstin"
                    placeholder="22AAAAA0000A1Z5"
                    value={form.gstin}
                    onChange={(e) => update("gstin", e.target.value)}
                  />

                  {/* Category multi-select */}
                  <fieldset>
                    <legend className="text-[10px] font-semibold text-muted-foreground">
                      What do you print or sell?{" "}
                      <span className="text-brand">*</span>
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {CATEGORIES.map((category) => (
                        <CategoryChip
                          key={category}
                          label={category}
                          active={form.categories.includes(category)}
                          onClick={() => toggleCategory(category)}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      {form.categories.length > 0
                        ? `${form.categories.length} selected`
                        : "Select at least one category."}
                    </p>
                  </fieldset>

                  <TextField
                    label="Catalogue Link (optional)"
                    name="catalogueUrl"
                    type="url"
                    placeholder="https://drive.google.com/…"
                    value={form.catalogueUrl}
                    onChange={(e) => update("catalogueUrl", e.target.value)}
                  />

                  <TextAreaField
                    label="Anything else we should know?"
                    name="note"
                    rows={4}
                    placeholder="Years in business, monthly volume, current customers, special finishes you offer..."
                    value={form.note}
                    onChange={(e) => update("note", e.target.value)}
                  />
{error && (
                    <div
                      role="alert"
                      className="px-4 py-3 text-[12.5px] font-medium"
                      style={{
                        background: "hsl(var(--destructive) / 0.08)",
                        color: "hsl(var(--destructive))",
                        border: "1px solid hsl(var(--destructive) / 0.18)",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => update("agreeTerms", e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
                    />
                    <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                      I confirm the information above is accurate and agree to the
                      Ink of Memories{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-brand hover:text-brand-hover"
                      >
                        Terms of Service
                      </Link>{" "}
                      &amp;{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-medium text-brand hover:text-brand-hover"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-none bg-footer px-8 py-4 text-xs font-semibold text-footer transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    {submitting ? "Sending application…" : "Submit Application"}
                    {!submitting && (
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* ───────── FAQ ───────── */}
          <section className="py-20">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-10 bg-gold" />
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    FAQ
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                  Questions,
                  <em className="font-medium text-brand"> answered</em>
                </h2>
              </div>

              <Accordion
                type="single"
                collapsible
                className="border-t border-border"
              >
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[14.5px] leading-[1.8] text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
