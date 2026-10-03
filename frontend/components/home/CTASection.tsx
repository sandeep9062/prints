"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenLine, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

/*
  Design notes
  - Same system as hero / testimonials / footer / atelier: midnight navy desk
    (bg-footer), champagne gold, brand-blue seal. The section behind the card is
    the cool off-white `bg-muted` so the navy card reads as a card.
  - The CTA is a stationery card on the desk: navy card, grain, a double gold
    rule and a gold-foil headline, like the cards in testimonials and the
    footer CTA.
  - Crop marks at the trim corners echo the Atelier press-sheet frame.
*/

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const MARKS = [
  "top-6 left-2 h-0.5 w-8",
  "left-6 top-2 h-8 w-0.5",
  "top-6 right-2 h-0.5 w-8",
  "right-6 top-2 h-8 w-0.5",
  "bottom-6 left-2 h-0.5 w-8",
  "bottom-2 left-6 h-8 w-0.5",
  "bottom-6 right-2 h-0.5 w-8",
  "bottom-2 right-6 h-8 w-0.5",
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
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export const CTASection: React.FC = () => {
  const [sectionRef, inView] = useInView<HTMLElement>(0.15);

  const reveal = (delay: string) =>
    `transition-all duration-1000 ease-out ${delay} ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-muted py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[1440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[200px]"
      />

      <div className="container relative mx-auto px-6">
        <div className={`relative mx-auto max-w-7xl p-6 sm:p-8 ${reveal("")}`}>
          {MARKS.map((m) => (
            <span
              key={m}
              aria-hidden="true"
              className={`absolute bg-foreground/50 ${m}`}
            />
          ))}

          <div className="relative overflow-hidden rounded-sm bg-footer shadow-[0_64px_160px_-56px_rgba(0,0,0,.6)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[.22] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-6 border-2 border-gold"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 border border-gold/50"
            />

            <div className="relative px-10 py-12 text-center sm:px-16 sm:py-14 lg:px-20 lg:py-16">
              <div
                className={`flex items-center justify-center gap-6 ${reveal("delay-100")}`}
              >
                <span aria-hidden="true" className="h-0.5 w-16 bg-gold/50" />
                <span className="text-sm font-medium text-footer-muted">
                  Bespoke services
                </span>
                <span aria-hidden="true" className="h-0.5 w-16 bg-gold/50" />
              </div>

              <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16 lg:text-left">
                <div className="lg:col-span-7">
                  <h2
                    id="cta-heading"
                    className={`font-serif text-5xl font-medium leading-[1.08] tracking-tight text-footer-foreground sm:text-6xl lg:text-7xl xl:text-8xl ${reveal("delay-200")}`}
                  >
                    Your vision,{" "}
                    {/* Large display line, so plain gold is used here (not
                        gold-text, which is for small text on light paper). */}
                    <span className="italic text-gold">exquisitely</span>{" "}
                    rendered.
                  </h2>

                  <p
                    className={`mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-footer-muted sm:text-xl lg:mx-0 lg:text-2xl ${reveal("delay-300")}`}
                  >
                    From sketch to final emboss — begin your design consultation
                    today.
                  </p>
                </div>

                <div className={`lg:col-span-5 ${reveal("delay-[400ms]")}`}>
                  <div className="flex flex-col items-center justify-center gap-6 sm:flex-row lg:justify-end">
                    <Button
                      asChild
                      className="h-16 min-w-[260px] rounded-full bg-gold px-10 text-base text-footer transition-colors hover:bg-gold/85 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-footer lg:h-20 lg:px-12 lg:text-lg"
                    >
                      <Link href="/customize">
                        <PenLine className="h-6 w-6" aria-hidden="true" />
                        Begin customization
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-16 min-w-[260px] rounded-full border-footer-foreground/40 bg-transparent px-10 text-base text-footer-foreground transition-colors hover:border-footer-foreground/10 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-footer lg:h-20 lg:px-12 lg:text-lg"
                    >
                      <Link href="/contact">
                        <Phone className="h-6 w-6" aria-hidden="true" />
                        Connect with us
                      </Link>
                    </Button>
                  </div>

                  <p
                    className={`mt-6 text-base text-footer-muted sm:text-lg lg:text-right lg:text-xl ${reveal("delay-500")}`}
                  >
                    Prefer to browse first?{" "}
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 font-medium text-footer-foreground underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
                    >
                      Explore the collection
                      <ArrowRight className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
