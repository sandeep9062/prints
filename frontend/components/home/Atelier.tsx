"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FOUNDED_YEAR } from "@/lib/site-config";

/*
  Design notes
  - Same system as the hero and testimonials: ink blue brand, brand-soft
    section, champagne gold accents — all semantic tokens.
  - The photo is framed like a printed press sheet: crop marks at the trim
    corners and a CMYK colour bar, which is real print-shop vernacular.
  - One entrance for the whole section, skipped under prefers-reduced-motion.
*/

type Stat = { n: string; suffix?: string; unit?: string; label: string };

const stats: Stat[] = [
  { n: "12,000", unit: "sq ft", label: "Atelier space" },
  { n: "47", label: "Master craftsmen" },
  { n: "100", suffix: "%", label: "In-house production" },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// Crop marks sit outside the trim corners of the photo
const MARKS = [
  "top-6 left-0 h-px w-4",
  "left-6 top-0 h-4 w-px",
  "top-6 right-0 h-px w-4",
  "right-6 top-0 h-4 w-px",
  "bottom-6 left-0 h-px w-4",
  "bottom-0 left-6 h-4 w-px",
  "bottom-6 right-0 h-px w-4",
  "bottom-0 right-6 h-4 w-px",
];

export default function Atelier() {
  const [sectionRef, inView] = useInView<HTMLElement>(0.15);

  const reveal = (delay: string) =>
    `transition-all duration-1000 ease-out ${delay} ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="atelier-heading"
      className="relative overflow-hidden bg-brand-soft py-24 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Press-sheet photo */}
          <figure
            className={`relative order-2 mx-auto w-full max-w-[480px] p-4 sm:p-6 lg:order-1 lg:col-span-6 lg:max-w-none ${reveal("delay-150")}`}
          >
            {MARKS.map((m) => (
              <span
                key={m}
                aria-hidden="true"
                className={`absolute bg-foreground/50 ${m}`}
              />
            ))}

            <div className="relative aspect-[4/5] overflow-hidden bg-muted shadow-[0_28px_60px_-28px_rgba(22,32,79,.35)]">
              <img
                src="/facility.jpg"
                alt="Inside our atelier"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* CMYK colour bar. The process inks come from the --process-* tokens
                (fixed print standards, not theme colours) and the black square is
                the ink token, so no component carries a raw hex. */}
            <div
              aria-hidden="true"
              className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-px"
            >
              {[
                "hsl(var(--process-cyan))",
                "hsl(var(--process-magenta))",
                "hsl(var(--process-yellow))",
              ].map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-6"
                  style={{ backgroundColor: c }}
                />
              ))}
              <span className="h-2.5 w-6 bg-ink" />
            </div>

            {/* Foil stamp */}
            <div
              role="img"
              aria-label={`Established ${FOUNDED_YEAR}`}
              className="absolute -right-2 bottom-20 flex h-24 w-24 -rotate-6 flex-col items-center justify-center rounded-full text-ink shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)] sm:-right-4"
              /* Foil gradient from a shared token so it matches the nav gold. */
              style={{ background: "var(--foil)" }}
            >
              <span className="pointer-events-none absolute inset-1.5 rounded-full border border-ink/40" />
              <span className="text-xs">Est.</span>
              <span className="font-serif text-3xl font-medium leading-none">
                {FOUNDED_YEAR}
              </span>
            </div>
          </figure>

          {/* Content */}
          <div className={`order-1 lg:order-2 lg:col-span-6 ${reveal("")}`}>
            <h2
              id="atelier-heading"
              className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              We own the machines.
            </h2>

            <div className="mt-8 max-w-[54ch] space-y-6">
              <p className="text-base leading-[1.75] text-foreground/80 md:text-lg">
                Our atelier houses heritage Heidelberg presses alongside modern
                foil-stamping equipment, all under one roof. Every order is
                touched only by our printers, so the quality holds from quote to
                dispatch.
              </p>
              <p className="border-l-2 border-gold pl-5 font-sans text-xl italic text-foreground">
                No middlemen. No compromise.
              </p>
            </div>

            {/* Stats ledger */}
            <dl className="mt-12 grid max-w-xl grid-cols-1 border-t border-border sm:grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`pt-6 sm:pr-4 ${
                    i > 0 ? "sm:border-l sm:border-border sm:pl-6" : ""
                  }`}
                >
                  <dd className="font-serif text-3xl font-medium tabular-nums text-foreground md:text-4xl">
                    {s.n}
                    {s.suffix}
                    {s.unit && (
                      <span className="ml-1.5 text-base md:text-lg">
                        {s.unit}
                      </span>
                    )}
                  </dd>
                  <dt className="mt-2 text-sm text-muted-foreground">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <Button
                asChild
                className="h-14 min-w-[220px] rounded-full bg-primary px-8 text-base text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {/* Point this at your real booking or contact page */}
                <Link href="/contact">Book a studio tour </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
