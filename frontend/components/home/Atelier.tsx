"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/*
  Design notes
  - Same system as the hero and testimonials: bottle-green ink (#1F3A32),
    pale sage paper, foil gold (#B08D4A).
  - The photo is framed like a printed press sheet: crop marks at the trim
    corners and a CMYK colour bar, which is real print-shop vernacular.
  - One entrance for the whole section, plus the count-up numbers.
    Both are skipped under prefers-reduced-motion.
*/

const stats = [
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

function Counter({
  target,
  suffix = "",
  unit,
  duration = 2000,
}: {
  target: string;
  suffix?: string;
  unit?: string;
  duration?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.3);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const el = numRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const end = parseFloat(target.replace(/,/g, ""));
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent =
        progress < 1 ? Math.floor(end * eased).toLocaleString() : target;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      <span ref={numRef}>{target}</span>
      {suffix}
      {unit && <span className="ml-1.5 text-base md:text-lg">{unit}</span>}
    </span>
  );
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
      className="relative overflow-hidden bg-[#EEF1E8] py-24 dark:bg-[#16211D] lg:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Press-sheet photo */}
          <figure
            className={`relative order-2 mx-auto w-full max-w-[480px] p-6 lg:order-1 lg:col-span-6 lg:max-w-none ${reveal("delay-150")}`}
          >
            {MARKS.map((m) => (
              <span
                key={m}
                aria-hidden="true"
                className={`absolute bg-[#1F3A32]/60 dark:bg-[#E4E9DD]/50 ${m}`}
              />
            ))}

            <div className="relative aspect-[4/5] overflow-hidden bg-[#D5DCCB] shadow-[0_28px_60px_-28px_rgba(31,58,50,.55)] dark:bg-[#22332D]">
              <img
                src="/facility.jpg"
                alt="Inside our atelier"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* CMYK colour bar */}
            <div
              aria-hidden="true"
              className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-px"
            >
              {["#00A0DC", "#E4007F", "#FFE600", "#1F3A32"].map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-6"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Foil stamp */}
            <div
              role="img"
              aria-label="Established 1984"
              className="absolute -right-2 bottom-20 flex h-24 w-24 -rotate-6 flex-col items-center justify-center rounded-full text-[#1F3A32] shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)] sm:-right-4"
              style={{
                background:
                  "linear-gradient(135deg,#E0C47F 0%,#B08D4A 50%,#D2AE62 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-1.5 rounded-full border border-[#1F3A32]/40" />
              <span className="text-xs">Est.</span>
              <span className="font-serif text-3xl font-medium leading-none">
                1984
              </span>
            </div>
          </figure>

          {/* Content */}
          <div className={`order-1 lg:order-2 lg:col-span-6 ${reveal("")}`}>
            <h2
              id="atelier-heading"
              className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#1F3A32] dark:text-[#F7F4EE] md:text-6xl lg:text-7xl"
            >
              We own the machines.
            </h2>

            <div className="mt-8 max-w-[54ch] space-y-6">
              <p className="text-base leading-[1.75] text-[#1F3A32]/80 dark:text-[#E4E9DD]/80 md:text-lg">
                Our atelier houses heritage Heidelberg presses alongside modern
                foil-stamping equipment, all under one roof. Every order is
                touched only by our printers, so the quality holds from quote to
                dispatch.
              </p>
              <p className="border-l-2 border-[#B08D4A] pl-5 font-serif text-xl italic text-[#1F3A32] dark:text-[#F7F4EE]">
                No middlemen. No compromise.
              </p>
            </div>

            {/* Stats ledger */}
            <dl className="mt-12 grid max-w-xl grid-cols-1 border-t border-[#1F3A32]/20 dark:border-[#E4E9DD]/20 sm:grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`pt-6 sm:pr-4 ${
                    i > 0
                      ? "sm:border-l sm:border-[#1F3A32]/20 sm:pl-6 dark:sm:border-[#E4E9DD]/20"
                      : ""
                  }`}
                >
                  <dd className="font-serif text-4xl font-medium tabular-nums text-[#1F3A32] dark:text-[#F7F4EE] md:text-5xl">
                    <Counter
                      target={s.n}
                      suffix={s.suffix}
                      unit={s.unit}
                      duration={2200 + i * 350}
                    />
                  </dd>
                  <dt className="mt-2 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <Button
                asChild
                className="h-14 min-w-[220px] rounded-full bg-[#1F3A32] px-8 text-base text-[#F7F4EE] transition-colors hover:bg-[#2B4F44] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:bg-[#F7F4EE] dark:text-[#1F3A32] dark:hover:bg-white dark:focus-visible:ring-offset-[#16211D]"
              >
                {/* Point this at your real booking or contact page */}
                <Link href="/contact">Book a studio tour</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
