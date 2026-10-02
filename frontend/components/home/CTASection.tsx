"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenLine, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

/*
  Design notes
  - Same system as hero / testimonials / footer / atelier: bottle-green
    desk (#1F3A32), bone paper (#F7F4EE), foil gold (#B08D4A / #D2AE62),
    wax rose (#A24B4B). Dark mode: deep green #121C18.
  - The CTA is a stationery card on the desk: bone paper, grain and a
    double gold rule, like the cards in testimonials and the footer CTA.
  - Crop marks at the trim corners echo the Atelier press-sheet frame.
*/

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const MARKS = [
  "top-3 left-1 h-px w-4",
  "left-3 top-1 h-4 w-px",
  "top-3 right-1 h-px w-4",
  "right-3 top-1 h-4 w-px",
  "bottom-3 left-1 h-px w-4",
  "bottom-1 left-3 h-4 w-px",
  "bottom-3 right-1 h-px w-4",
  "bottom-1 right-3 h-4 w-px",
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
      className="relative overflow-hidden bg-[#1F3A32] py-10 dark:bg-[#121C18] lg:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D2AE62]/10 blur-[100px]"
      />

      <div className="container relative mx-auto px-6">
        <div className={`relative mx-auto max-w-6xl p-3 sm:p-4 ${reveal("")}`}>
          {MARKS.map((m) => (
            <span
              key={m}
              aria-hidden="true"
              className={`absolute bg-[#E4E9DD]/50 ${m}`}
            />
          ))}

          <div className="relative overflow-hidden rounded-sm bg-[#F7F4EE] shadow-[0_32px_80px_-28px_rgba(0,0,0,.6)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[.22] mix-blend-multiply"
              style={{ backgroundImage: GRAIN }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-[#B08D4A]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 border border-[#B08D4A]/50"
            />

            <div className="relative px-5 py-6 text-center sm:px-8 sm:py-7 lg:px-10 lg:py-8">
              <div
                className={`flex items-center justify-center gap-3 ${reveal("delay-100")}`}
              >
                <span aria-hidden="true" className="h-px w-8 bg-[#1F3A32]/40" />
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#1F3A32]/70">
                  Bespoke services
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-[#1F3A32]/40" />
              </div>

              <div className="mt-5 grid items-center gap-6 lg:grid-cols-12 lg:gap-8 lg:text-left">
                <div className="lg:col-span-7">
                  <h2
                    id="cta-heading"
                    className={`font-serif text-3xl font-medium leading-[1.08] tracking-tight text-[#1F3A32] sm:text-4xl lg:text-5xl ${reveal("delay-200")}`}
                  >
                    Your vision,{" "}
                    <span className="italic text-[#8A6A2F]">exquisitely</span>{" "}
                    rendered.
                  </h2>

                  <p
                    className={`mx-auto mt-3 max-w-[52ch] text-sm leading-relaxed text-[#1F3A32]/80 sm:text-base lg:mx-0 ${reveal("delay-300")}`}
                  >
                    From sketch to final emboss — begin your design consultation
                    today.
                  </p>
                </div>

                <div className={`lg:col-span-5 ${reveal("delay-[400ms]")}`}>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-end">
                    <Button
                      asChild
                      className="h-12 min-w-[190px] rounded-full bg-[#1F3A32] px-7 text-sm text-[#F7F4EE] transition-colors hover:bg-[#2B4F44] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EE]"
                    >
                      <Link href="/customize">
                        <PenLine className="h-4 w-4" aria-hidden="true" />
                        Begin customization
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-12 min-w-[190px] rounded-full border-[#1F3A32]/40 bg-transparent px-7 text-sm text-[#1F3A32] transition-colors hover:border-[#1F3A32] hover:bg-[#1F3A32]/5 focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EE]"
                    >
                      <Link href="/contact">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Connect with us
                      </Link>
                    </Button>
                  </div>

                  <p
                    className={`mt-3 text-xs text-[#1F3A32]/60 sm:text-sm lg:text-right ${reveal("delay-500")}`}
                  >
                    Prefer to browse first?{" "}
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 underline decoration-[#B08D4A] decoration-1 underline-offset-4 transition-colors hover:text-[#1F3A32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EE]"
                    >
                      Explore the collection
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
