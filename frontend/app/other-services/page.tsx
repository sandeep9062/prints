import {
  Heart,
  ScrollText,
  PenTool,
  Package,
  Notebook,
  BookOpen,
  Printer,
  Stamp,
  Sparkles,
  Layers,
  Tag,
  ArrowRight,
  Star,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  HeartHandshake,
  MapPinned,
} from "lucide-react";

import { FOUNDED_YEAR } from "@/lib/site-config";

// ---------------------------------------------------------------------------
// Fonts — Cormorant Garamond for display/headings 28px and up, DM Sans for
// everything else. Both are self-hosted via next/font (see app/layout.tsx).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Content — printing categories, mirroring the homepage category grid.
// Accents are palette tokens: brand blue, champagne gold (as an icon / thin
// line only), and ink navy for the deeper tiles.
// ---------------------------------------------------------------------------
const categories = [
  {
    name: "Wedding Cards",
    note: "Bespoke invitations",
    icon: Heart,
    color: "hsl(var(--brand))",
  },
  {
    name: "Invitation Cards",
    note: "Every milestone",
    icon: ScrollText,
    color: "hsl(var(--gold-text))",
  },
  {
    name: "Visiting Cards",
    note: "Make a first impression",
    icon: PenTool,
    color: "hsl(var(--foreground))",
  },
  {
    name: "Shagun Envelopes",
    note: "Traditional, modern touch",
    icon: Package,
    color: "hsl(var(--brand-hover))",
  },
  {
    name: "Letter Pads",
    note: "Corporate & personal",
    icon: Notebook,
    color: "hsl(var(--gold-text))",
  },
  {
    name: "Brochures",
    note: "Tell your brand story",
    icon: BookOpen,
    color: "hsl(var(--brand))",
  },
  {
    name: "Banners & Flex",
    note: "Large-format printing",
    icon: Printer,
    color: "hsl(var(--brand-hover))",
  },
  {
    name: "Books & Bindings",
    note: "Hardcover & softcover",
    icon: Layers,
    color: "hsl(var(--footer))",
  },
  {
    name: "Stickers",
    note: "Custom die-cuts",
    icon: Tag,
    color: "hsl(var(--foreground))",
  },
  {
    name: "Rubber Stamps",
    note: "Office essentials",
    icon: Stamp,
    color: "hsl(var(--brand))",
  },
];

export default function PrintingServicesCategoryPage() {
  return (
    <div className="min-h-screen bg-card text-foreground antialiased">
      <Hero />
      <CategoryGrid />
      <TrustStrip />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero — a wide headline panel plus two example listing cards that double as
// a preview of what a provider profile looks like on the platform.
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-36 lg:px-10 lg:pb-20 lg:pt-40">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.75fr_0.75fr] lg:gap-7">
        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card/60 px-8 py-12 lg:px-12 lg:py-16">
          <h1 className="font-serif text-[2.6rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[3.1rem]">
            From Idea, <span className="text-brand">To Finished Print</span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            A complete in-house printing atelier — wedding cards, visiting
            cards, shagun envelopes, brochures, banners and packaging. From
            your first sketch to the final emboss, we stay involved at every
            step of the print.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#categories"
              className="rounded-md bg-brand px-6 py-3 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-brand-hover"
            >
              Explore Services
            </a>
            <a
              href="/other-services/register"
              className="rounded-md border border-border px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:border-brand"
            >
              Start Your Print
            </a>
          </div>
        </div>

        <ListingPreviewCard
          eyebrow="Signature collection"
          name="Bespoke Wedding Suites"
          tagline="Letterpress and foil, proofed on real paper before we press."
          location="Panchkula, India"
          rating="4.9"
          count="50 designs"
          accent="hsl(var(--brand))"
        />

        <PrintShopPreviewCard />
      </div>
    </section>
  );
}

function ListingPreviewCard({
  eyebrow,
  name,
  tagline,
  location,
  rating,
  count,
  accent,
}: {
  eyebrow: string;
  name: string;
  tagline: string;
  location: string;
  rating: string;
  count: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 lg:p-9">
      <div>
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          <span className="text-sm text-muted-foreground">{eyebrow}</span>
        </div>
        <h3 className="mt-5 font-sans text-2xl font-semibold text-foreground">
          {name}
        </h3>
        <p className="mt-3 text-[15px] leading-snug text-muted-foreground">
          {tagline}
        </p>
      </div>
      <div className="mt-10 flex items-end justify-between border-t border-border pt-6">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {location}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Star
              className="h-3.5 w-3.5 fill-current text-gold"
              strokeWidth={0}
            />
            <span className="font-medium text-foreground">{rating}</span> ·{" "}
            {count}
          </div>
        </div>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-brand"
        >
          View profile
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

function PrintShopPreviewCard() {
  const services = [
    { label: "Letterpress", icon: Stamp },
    { label: "Foil Stamping", icon: Sparkles },
    { label: "Offset & Digital", icon: Printer },
  ];
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-hover p-8 text-primary-foreground lg:p-9">
      <div>
        <div className="flex items-center gap-2">
          <CheckCircle2
            className="h-3.5 w-3.5 text-gold"
            strokeWidth={2}
          />
          <span className="text-sm text-primary-foreground/75">In-house production</span>
        </div>
        <h3 className="mt-5 font-sans text-2xl font-semibold">
          The Ink of Memories Atelier
        </h3>
        <p className="mt-3 text-[15px] leading-snug text-primary-foreground/75">
          Real papers. Real proofs. No middlemen, no compromise.
        </p>
      </div>
      <div className="mt-10">
        <div className="flex gap-4">
          {services.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground/10">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="text-[11px] text-primary-foreground/75">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-border/10 pt-6 text-sm">
          <span className="text-primary-foreground/75">
            Serving Panchkula, Chandigarh &amp; beyond
          </span>
          <a
            href="#"
            className="flex items-center gap-1 font-medium hover:text-gold"
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category grid
// ---------------------------------------------------------------------------
function CategoryGrid() {
  return (
    <section
      id="categories"
      className="mx-auto max-w-[1400px] px-6 pb-24 pt-4 lg:px-10"
    >
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-[1.9rem] font-medium tracking-tight text-foreground">
          What are you looking to print?
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover"
        >
          Browse all categories
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
        {categories.map(({ name, note, icon: Icon, color }) => (
          <a
            key={name}
            href="#"
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-transparent"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-primary-foreground"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-snug text-foreground">
                {name}
              </span>
              <span className="mt-0.5 block text-[13px] text-muted-foreground">
                {note}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Trust strip — quiet, textual assurances, no numbers or figures
// ---------------------------------------------------------------------------
function TrustStrip() {
  const assurances = [
    {
      title: "Proofed Before Press",
      text: "Every order is proofed with you on real paper — matte, linen, cotton or pearl shimmer — before a single sheet goes on press.",
      icon: BadgeCheck,
    },
    {
      title: "In-House Production",
      text: "Heritage Heidelberg presses alongside modern foil-stamping equipment, all under one roof. Every order is touched only by our printers.",
      icon: HeartHandshake,
    },
    {
      title: `Local Craft, Since ${FOUNDED_YEAR}`,
      text: "Deep roots in Panchkula and Chandigarh, with on-ground knowledge of papers, foils, finishing and what actually lasts.",
      icon: MapPinned,
    },
  ];
  return (
    <section className="border-y border-border bg-brand-soft">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-border px-6 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
        {assurances.map(({ title, text, icon: Icon }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-3 px-2 py-10 sm:px-8 sm:py-14"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand text-primary-foreground">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-sans text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
