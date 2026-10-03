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

// ---------------------------------------------------------------------------
// Fonts — Poppins for display/headings (loaded globally in globals.css and
// used across the homepage via the `font-[Poppins]` utility). Body copy uses
// the app's default sans (Geist Sans from the root layout).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Content — printing categories, mirroring the homepage category grid.
// Category accent colours are kept as-is.
// ---------------------------------------------------------------------------
const categories = [
  {
    name: "Wedding Cards",
    note: "Bespoke invitations",
    icon: Heart,
    color: "#A24B4B",
  },
  {
    name: "Invitation Cards",
    note: "Every milestone",
    icon: ScrollText,
    color: "#B08D4A",
  },
  {
    name: "Visiting Cards",
    note: "Make a first impression",
    icon: PenTool,
    color: "#1F3A32",
  },
  {
    name: "Shagun Envelopes",
    note: "Traditional, modern touch",
    icon: Package,
    color: "#7A4B6D",
  },
  {
    name: "Letter Pads",
    note: "Corporate & personal",
    icon: Notebook,
    color: "#2C6E6B",
  },
  {
    name: "Brochures",
    note: "Tell your brand story",
    icon: BookOpen,
    color: "#E4A73B",
  },
  {
    name: "Banners & Flex",
    note: "Large-format printing",
    icon: Printer,
    color: "#B5622A",
  },
  {
    name: "Books & Bindings",
    note: "Hardcover & softcover",
    icon: Layers,
    color: "#14282F",
  },
  {
    name: "Stickers",
    note: "Custom die-cuts",
    icon: Tag,
    color: "#4B7B62",
  },
  {
    name: "Rubber Stamps",
    note: "Office essentials",
    icon: Stamp,
    color: "#5B4B8A",
  },
];

export default function PrintingServicesCategoryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
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
        <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white/60 px-8 py-12 lg:px-12 lg:py-16">
          <h1 className="font-[Poppins] text-[2.6rem] font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-[3.1rem]">
            From Idea, <span className="text-[#4161df]">To Finished Print</span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-slate-600">
            A complete in-house printing atelier — wedding cards, visiting
            cards, shagun envelopes, brochures, banners and packaging. From
            your first sketch to the final emboss, we stay involved at every
            step of the print.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#categories"
              className="rounded-md bg-[#4161df] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#3456df]"
            >
              Explore Services
            </a>
            <a
              href="/other-services/register"
              className="rounded-md border border-slate-300 px-6 py-3 text-[15px] font-medium text-slate-900 transition-colors hover:border-[#4161df] hover:text-[#4161df]"
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
          accent="#4161df"
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
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 lg:p-9">
      <div>
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          <span className="text-sm text-slate-500">{eyebrow}</span>
        </div>
        <h3 className="mt-5 font-[Poppins] text-2xl font-semibold text-slate-900">
          {name}
        </h3>
        <p className="mt-3 text-[15px] leading-snug text-slate-600">
          {tagline}
        </p>
      </div>
      <div className="mt-10 flex items-end justify-between border-t border-slate-200 pt-6">
        <div className="text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {location}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Star
              className="h-3.5 w-3.5 fill-current text-amber-400"
              strokeWidth={0}
            />
            <span className="font-medium text-slate-900">{rating}</span> ·{" "}
            {count}
          </div>
        </div>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-[#4161df]"
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
    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#4161df] to-[#3451c7] p-8 text-white lg:p-9">
      <div>
        <div className="flex items-center gap-2">
          <CheckCircle2
            className="h-3.5 w-3.5 text-amber-300"
            strokeWidth={2}
          />
          <span className="text-sm text-white/60">In-house production</span>
        </div>
        <h3 className="mt-5 font-[Poppins] text-2xl font-semibold">
          The Ink of Memories Atelier
        </h3>
        <p className="mt-3 text-[15px] leading-snug text-white/70">
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
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="text-[11px] text-white/60">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
          <span className="text-white/60">
            Serving Panchkula, Chandigarh &amp; beyond
          </span>
          <a
            href="#"
            className="flex items-center gap-1 font-medium hover:text-amber-300"
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
        <h2 className="font-[Poppins] text-[1.9rem] font-bold tracking-tight text-slate-900">
          What are you looking to print?
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-[#4161df] hover:text-[#3456df]"
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
            className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-transparent"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-snug text-slate-900">
                {name}
              </span>
              <span className="mt-0.5 block text-[13px] text-slate-500">
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
      title: "Local Craft, Since 1984",
      text: "Deep roots in Panchkula and Chandigarh, with on-ground knowledge of papers, foils, finishing and what actually lasts.",
      icon: MapPinned,
    },
  ];
  return (
    <section className="border-y border-slate-200 bg-[#eeeeff]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-slate-200 px-6 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
        {assurances.map(({ title, text, icon: Icon }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-3 px-2 py-10 sm:px-8 sm:py-14"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#4161df] text-white">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-[Poppins] text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="max-w-xs text-[15px] leading-relaxed text-slate-600">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
