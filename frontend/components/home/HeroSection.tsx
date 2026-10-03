"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FOUNDED_YEAR } from "@/lib/site-config";

/*
  Design notes
  - Palette: ink blue brand, warm ivory paper, champagne gold accents, all via
    semantic tokens (see globals.css). Dark mode comes from the tokens, so no
    `dark:` colour overrides are needed here.
  - Type: Cormorant Garamond (`font-serif`) for headings and for the printed
    text on the invitation artwork (kept at 15px and up, weight 500, because
    the thin strokes get weak below that). DM Sans (`font-sans`) for the UI.
  - Memorable element: an invitation suite built in CSS. Visitors can swap the
    paper stock and see the card change, which previews the real service.
*/

const DEBOSS = "0 1px 0 rgba(255,255,255,.85), 0 -1px 0 rgba(22,32,79,.25)";

// Paper grain as an inline SVG, so no extra requests
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

// Gold foil seal, derived from the --gold token so it follows the theme.
const FOIL_SEAL =
  "radial-gradient(circle at 35% 30%, color-mix(in srgb, hsl(var(--gold)) 55%, white) 0, hsl(var(--gold)) 50%, color-mix(in srgb, hsl(var(--gold)) 70%, black) 100%)";

// Swappable stocks. `hsl(var(--token))` (not the Tailwind class) because these
// are pushed into an inline `style` and swapped at runtime by the picker.
// The "midnight" stock is midnight navy with gold foil; the rest are the
// ivory / blush / mist papers shared with the testimonial cards.
const PAPERS = [
  {
    id: "bone",
    name: "Bone cotton, letterpress",
    card: "hsl(var(--paper-1))",
    rsvp: "hsl(var(--paper-1-deep))",
    type: "hsl(var(--paper-ink))",
    shadow: DEBOSS,
    rule: "hsl(var(--gold))",
  },
  {
    id: "blush",
    name: "Blush cotton, letterpress",
    card: "hsl(var(--paper-2))",
    rsvp: "hsl(var(--paper-2-deep))",
    type: "hsl(var(--paper-ink))",
    shadow: DEBOSS,
    rule: "hsl(var(--gold))",
  },
  {
    id: "mist",
    name: "Mist blue, letterpress",
    card: "hsl(var(--paper-3))",
    rsvp: "hsl(var(--paper-3-deep))",
    type: "hsl(var(--paper-ink))",
    shadow: DEBOSS,
    rule: "hsl(var(--gold))",
  },
  {
    id: "midnight",
    name: "Midnight navy, gold foil",
    card: "hsl(var(--paper-4))",
    rsvp: "hsl(var(--paper-4-deep))",
    type: "hsl(var(--paper-4-ink))",
    shadow: "none",
    rule: "hsl(var(--gold))",
  },
] as const;

const Grain = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 rounded-sm opacity-[.22] mix-blend-multiply"
    style={{ backgroundImage: GRAIN }}
  />
);

export const HeroSection: React.FC = () => {
  const [paperId, setPaperId] = useState<(typeof PAPERS)[number]["id"]>("bone");
  const paper = PAPERS.find((p) => p.id === paperId) ?? PAPERS[0];

  const paperStyle = (extra: React.CSSProperties = {}) =>
    ({
      transition: "background-color .5s, color .5s",
      color: paper.type,
      textShadow: paper.shadow,
      ...extra,
    }) as React.CSSProperties;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background pt-[calc(var(--navbar-height)+2rem)] pb-24 lg:pt-[calc(var(--navbar-height)+4rem)] lg:pb-32"
    >
      <style>{`
        @keyframes suite-settle {
          from { opacity: 0; transform: translateY(24px) rotate(var(--from, 0deg)); }
          to   { opacity: 1; transform: translateY(0) rotate(var(--to, 0deg)); }
        }
        .suite-card { animation: suite-settle .9s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .suite-card { animation: none; transform: rotate(var(--to, 0deg)); }
        }
      `}</style>

      {/* A soft brand-blue wash bleeding in from the right, so the white page
          still reads as paper rather than flat white. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-brand-soft lg:block"
        style={{
          maskImage: "linear-gradient(to left, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, transparent 100%)",
        }}
      />

      {/* Faint grain across the whole section so the page feels like paper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Copy: left aligned, short measure */}
          <div className="lg:col-span-6">
            <p className="mb-6 text-sm text-muted-foreground">
              Letterpress and foil stationery, since {FOUNDED_YEAR}
            </p>

            <h1
              id="hero-heading"
              className="max-w-[14ch] font-serif text-5xl font-medium leading-[1.04] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              Wedding invitations, printed slowly.
            </h1>

            <p className="mt-8 max-w-[52ch] text-base leading-[1.75] text-foreground/80 md:text-lg">
              Each suite is designed with you, proofed on real paper, and
              finished by hand using heritage printing techniques.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-14 min-w-[200px] rounded-full bg-primary px-8 text-base text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <Link href="/products">Browse invitations</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 min-w-[200px] rounded-full border-foreground/40 bg-transparent px-8 text-base text-foreground transition-colors hover:border-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <Link href="/customize">Book a consultation</Link>
              </Button>
            </div>

            <p className="mt-12 max-w-[46ch] border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              Trusted by over 50,000 clients, with more than 100 original
              designs in the collection.
            </p>
          </div>

          {/* Invitation suite + paper picker */}
          <div className="mx-auto w-full max-w-[460px] lg:col-span-6 lg:max-w-none">
            <div
              role="img"
              aria-label={`Sample wedding invitation suite on ${paper.name}: envelope, invitation, RSVP card and wax seal`}
              className="relative h-[440px] w-full sm:h-[520px]"
            >
              {/* Envelope: open flap + striped liner, in soft blush paper */}
              <div
                className="suite-card absolute left-0 top-[36%] h-[54%] w-[58%] rounded-sm shadow-[0_18px_40px_-18px_rgba(22,32,79,.4)]"
                style={
                  {
                    "--from": "-9deg",
                    "--to": "-5deg",
                    animationDelay: ".05s",
                    background:
                      "repeating-linear-gradient(135deg,hsl(var(--paper-2-deep)) 0 2px,hsl(var(--paper-2)) 2px 14px)",
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute -top-[26%] left-0 h-[27%] w-full"
                  style={{
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    background:
                      "color-mix(in srgb, hsl(var(--paper-2-deep)) 82%, white)",
                  }}
                />
              </div>

              {/* Invitation */}
              <div
                className="suite-card absolute left-[30%] top-0 flex h-[84%] w-[58%] flex-col items-center justify-center rounded-sm px-6 text-center shadow-[0_28px_60px_-20px_rgba(22,32,79,.5)]"
                style={paperStyle({
                  backgroundColor: paper.card,
                  animationDelay: ".2s",
                  ["--from" as string]: "4deg",
                  ["--to" as string]: "2deg",
                })}
              >
                <Grain />
                {/* Double rule, the classic stationery border */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border transition-colors duration-500"
                  style={{ borderColor: paper.rule }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 border opacity-50 transition-colors duration-500"
                  style={{ borderColor: paper.rule }}
                />
                <span className="relative font-serif text-base font-medium leading-snug tracking-wide">
                  Together with their families
                </span>
                <span className="relative mt-6 font-serif text-4xl font-medium leading-tight sm:text-5xl">
                  Amelia
                  <br />
                  <span className="text-2xl italic">and</span>
                  <br />
                  Rohan
                </span>
                <span className="relative mt-6 font-serif text-base font-medium leading-snug tracking-wide">
                  invite you to celebrate their wedding
                </span>
                <span className="relative mt-2 font-serif text-lg font-medium">
                  Saturday, 14 June
                </span>
              </div>

              {/* RSVP card */}
              <div
                className="suite-card absolute bottom-0 right-0 flex h-[30%] w-[40%] flex-col items-center justify-center rounded-sm shadow-[0_18px_40px_-16px_rgba(22,32,79,.55)]"
                style={paperStyle({
                  backgroundColor: paper.rsvp,
                  animationDelay: ".35s",
                  ["--from" as string]: "-2deg",
                  ["--to" as string]: "-4deg",
                })}
              >
                <Grain />
                <span className="relative font-serif text-3xl font-medium italic">
                  RSVP
                </span>
                <span className="relative mt-1 font-serif text-base font-medium">
                  by 1 May
                </span>
              </div>

              {/* Gold foil wax seal with a navy serif monogram */}
              <div
                aria-hidden="true"
                className="suite-card absolute bottom-[12%] left-[20%] flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_16px_-6px_rgba(0,0,0,.55)] sm:h-20 sm:w-20"
                style={
                  {
                    "--from": "0deg",
                    "--to": "0deg",
                    animationDelay: ".5s",
                    background: FOIL_SEAL,
                  } as React.CSSProperties
                }
              >
                <span
                  className="absolute inset-2 rounded-full border"
                  style={{ borderColor: "hsl(var(--ink) / .35)" }}
                />
                <span
                  className="font-serif text-2xl font-semibold italic sm:text-3xl"
                  style={{
                    color: "hsl(var(--ink))",
                    textShadow: "0 1px 0 rgba(255,255,255,.35)",
                  }}
                >
                  A&amp;R
                </span>
              </div>
            </div>

            {/* Paper picker: motion that answers an action */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span id="paper-label" className="text-sm text-muted-foreground">
                Try a paper
              </span>
              <div
                role="radiogroup"
                aria-labelledby="paper-label"
                className="flex gap-3"
              >
                {PAPERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === paperId}
                    aria-label={p.name}
                    onClick={() => setPaperId(p.id)}
                    className="h-8 w-8 rounded-full border border-foreground/30 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-checked:ring-2 aria-checked:ring-foreground aria-checked:ring-offset-2 aria-checked:ring-offset-background motion-reduce:transition-none"
                    style={{ backgroundColor: p.card }}
                  />
                ))}
              </div>
              <span aria-live="polite" className="text-sm text-foreground">
                {paper.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
