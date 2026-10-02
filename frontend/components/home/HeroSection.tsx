"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/*
  Design notes
  - Palette: sage paper #E4E9DD, bottle-green ink #1F3A32, foil gold #B08D4A,
    wax rose #A24B4B. Dark mode: deep green #16211D.
  - Type: use a high-contrast serif for `font-serif` (Cormorant Garamond via
    next/font works well) and your site sans for body.
  - Memorable element: an invitation suite built in CSS. Visitors can swap the
    paper stock and see the card change, which previews the real service.
*/

const DEBOSS = "0 1px 0 rgba(255,255,255,.85), 0 -1px 0 rgba(31,58,50,.25)";

// Paper grain as an inline SVG, so no extra requests
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const PAPERS = [
  {
    id: "bone",
    name: "Bone cotton, blind deboss",
    card: "#F7F4EE",
    rsvp: "#EFE9DC",
    type: "#D8D0C0",
    shadow: DEBOSS,
    rule: "#B08D4A",
  },
  {
    id: "blush",
    name: "Blush cotton, blind deboss",
    card: "#F4E4E0",
    rsvp: "#EBD4CF",
    type: "#DDBFB9",
    shadow: DEBOSS,
    rule: "#B08D4A",
  },
  {
    id: "mist",
    name: "Mist blue, blind deboss",
    card: "#E3EAEF",
    rsvp: "#D5DFE7",
    type: "#BCCAD4",
    shadow: DEBOSS,
    rule: "#B08D4A",
  },
  {
    id: "midnight",
    name: "Midnight green, gold foil",
    card: "#22332D",
    rsvp: "#1B2A25",
    type: "#D2AE62",
    shadow: "none",
    rule: "#D2AE62",
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
      className="relative overflow-hidden bg-[#E4E9DD] pt-[calc(var(--navbar-height)+2rem)] pb-24 dark:bg-[#16211D] lg:pt-[calc(var(--navbar-height)+4rem)] lg:pb-32"
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

      {/* Faint grain across the whole section so the page feels like paper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-multiply dark:hidden"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Copy: left aligned, short measure */}
          <div className="lg:col-span-6">
            <p className="mb-6 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
              Letterpress and foil stationery, since 1984
            </p>

            <h1
              id="hero-heading"
              className="max-w-[14ch] font-serif text-5xl font-medium leading-[1.04] tracking-tight text-[#1F3A32] dark:text-[#F7F4EE] md:text-6xl lg:text-7xl"
            >
              Wedding invitations, printed slowly.
            </h1>

            <p className="mt-8 max-w-[52ch] text-base leading-[1.75] text-[#1F3A32]/80 dark:text-[#E4E9DD]/80 md:text-lg">
              Each suite is designed with you, proofed on real paper, and
              finished by hand using heritage printing techniques.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-14 min-w-[200px] rounded-full bg-[#1F3A32] px-8 text-base text-[#F7F4EE] transition-colors hover:bg-[#2B4F44] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:bg-[#F7F4EE] dark:text-[#1F3A32] dark:hover:bg-white dark:focus-visible:ring-offset-[#16211D]"
              >
                <Link href="/products">Browse invitations</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 min-w-[200px] rounded-full border-[#1F3A32]/40 bg-transparent px-8 text-base text-[#1F3A32] transition-colors hover:border-[#1F3A32] hover:bg-[#1F3A32]/5 focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:border-[#E4E9DD]/40 dark:text-[#F7F4EE] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#16211D]"
              >
                <Link href="/customize">Book a consultation</Link>
              </Button>
            </div>

            <p className="mt-12 max-w-[46ch] border-t border-[#1F3A32]/20 pt-6 text-sm leading-relaxed text-[#1F3A32]/70 dark:border-[#E4E9DD]/20 dark:text-[#E4E9DD]/70">
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
              {/* Envelope: open flap + striped liner */}
              <div
                className="suite-card absolute left-0 top-[36%] h-[54%] w-[58%] rounded-sm shadow-[0_18px_40px_-18px_rgba(31,58,50,.5)]"
                style={
                  {
                    "--from": "-9deg",
                    "--to": "-5deg",
                    animationDelay: ".05s",
                    background:
                      "repeating-linear-gradient(135deg,#C9A3A0 0 2px,#D8B8B4 2px 14px)",
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute -top-[26%] left-0 h-[27%] w-full bg-[#C39A95]"
                  style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
                />
              </div>

              {/* Invitation */}
              <div
                className="suite-card absolute left-[30%] top-0 flex h-[84%] w-[58%] flex-col items-center justify-center rounded-sm px-6 text-center shadow-[0_28px_60px_-20px_rgba(31,58,50,.6)]"
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
                <span className="relative font-serif text-xs tracking-wide">
                  Together with their families
                </span>
                <span className="relative mt-6 font-serif text-4xl leading-tight sm:text-5xl">
                  Amelia
                  <br />
                  <span className="text-2xl italic">and</span>
                  <br />
                  Rohan
                </span>
                <span className="relative mt-6 font-serif text-xs tracking-wide">
                  invite you to celebrate their wedding
                </span>
                <span className="relative mt-2 font-serif text-sm">
                  Saturday, 14 June
                </span>
              </div>

              {/* RSVP card */}
              <div
                className="suite-card absolute bottom-0 right-0 flex h-[30%] w-[40%] flex-col items-center justify-center rounded-sm shadow-[0_18px_40px_-16px_rgba(31,58,50,.55)]"
                style={paperStyle({
                  backgroundColor: paper.rsvp,
                  animationDelay: ".35s",
                  ["--from" as string]: "-2deg",
                  ["--to" as string]: "-4deg",
                })}
              >
                <Grain />
                <span className="relative font-serif text-2xl italic">
                  RSVP
                </span>
                <span className="relative mt-1 font-serif text-xs">
                  by 1 May
                </span>
              </div>

              {/* Wax seal with monogram */}
              <div
                aria-hidden="true"
                className="suite-card absolute bottom-[12%] left-[20%] flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_16px_-6px_rgba(0,0,0,.55)] sm:h-20 sm:w-20"
                style={
                  {
                    "--from": "0deg",
                    "--to": "0deg",
                    animationDelay: ".5s",
                    background:
                      "radial-gradient(circle at 35% 30%,#C26666 0,#A24B4B 45%,#7E3535 100%)",
                  } as React.CSSProperties
                }
              >
                <span className="absolute inset-2 rounded-full border border-[#E9B5B5]/40" />
                <span
                  className="font-serif text-lg italic text-[#8E3D3D] sm:text-xl"
                  style={{
                    textShadow:
                      "0 1px 0 rgba(255,255,255,.25), 0 -1px 0 rgba(0,0,0,.35)",
                  }}
                >
                  A&amp;R
                </span>
              </div>
            </div>

            {/* Paper picker: motion that answers an action */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span
                id="paper-label"
                className="text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70"
              >
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
                    className="h-8 w-8 rounded-full border border-[#1F3A32]/30 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4E9DD] aria-checked:ring-2 aria-checked:ring-[#1F3A32] aria-checked:ring-offset-2 aria-checked:ring-offset-[#E4E9DD] dark:border-white/30 dark:focus-visible:ring-offset-[#16211D] dark:aria-checked:ring-[#F7F4EE] dark:aria-checked:ring-offset-[#16211D] motion-reduce:transition-none"
                    style={{ backgroundColor: p.card }}
                  />
                ))}
              </div>
              <span
                aria-live="polite"
                className="text-sm text-[#1F3A32] dark:text-[#F7F4EE]"
              >
                {paper.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
