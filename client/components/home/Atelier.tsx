"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { n: "12,000", suffix: " sq ft", l: "Atelier Space" },
  { n: "47", suffix: "", l: "Master Craftsmen" },
  { n: "100", suffix: "%", l: "In-House Production" },
];

function Counter({
  target,
  suffix,
  duration = 2000,
}: {
  target: string;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const el = ref.current;
    if (!el) return;

    const raw = target.replace(/,/g, "");
    const hasDecimal = raw.includes(".");
    const endVal = parseFloat(raw);
    const startVal = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;

      if (hasDecimal) {
        el!.textContent = current.toFixed(1) + suffix;
      } else {
        el!.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el!.textContent = target + suffix;
      }
    }

    requestAnimationFrame(animate);
  }, [inView, target, suffix, duration]);

  return <span ref={ref}>{target + suffix}</span>;
}

function AnimatedLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[2px] w-full max-w-[80px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-stone-700" />
      <div
        className={`absolute inset-0 bg-red-800 transition-all duration-[1200ms] ease-out ${
          visible ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Atelier() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBF9] dark:bg-[#0f111a]">
      {/* Background detail */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F4F1EE] dark:bg-[#0d1321]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center min-h-[500px] py-16">
          {/* ─── IMAGE SIDE ─── */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 pt-12">
                <div className="relative overflow-hidden border border-stone-200 dark:border-stone-700">
                  <img
                    src="/facility.jpg"
                    alt="Our atelier"
                    className="w-full aspect-[3/4] object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Stat Overlay */}
            <div className="absolute -bottom-6 -left-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 p-6 hidden md:block">
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-1">
                Established
              </p>
              <p className="font-serif text-4xl">1984</p>
            </div>
          </div>

          {/* ─── CONTENT SIDE ─── */}
          <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
            {/* Eyebrow */}
            <FadeInSection>
              <div className="flex items-center space-x-3">
                <span className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
                <span className="text-[10px] font-bold tracking-[0.4em] text-stone-400 dark:text-stone-500 uppercase">
                  Owned & Operated
                </span>
              </div>
            </FadeInSection>

            {/* Heading */}
            <FadeInSection delay={150}>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 leading-tight">
                We own the
                <br />
                <span className="italic text-red-800 dark:text-red-600 font-light">
                  machines.
                </span>
              </h2>
            </FadeInSection>

            {/* Description */}
            <FadeInSection delay={300}>
              <div className="space-y-4 max-w-xl">
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                  Our atelier houses heritage Heidelberg presses alongside
                  modern foil-stamping equipment — all under one roof. Every
                  order is touched only by our printers, ensuring uncompromised
                  quality from quote to dispatch.
                </p>
                <p className="text-stone-500 text-sm italic border-l-2 border-stone-200 dark:border-stone-700 pl-4">
                  &ldquo;No middlemen. No compromise.&rdquo;
                </p>
              </div>
            </FadeInSection>

            {/* Stats */}
            <FadeInSection delay={450}>
              <AnimatedLine />
              <div className="grid grid-cols-3 gap-x-10 gap-y-8 pt-6">
                {stats.map((s, i) => (
                  <div key={s.l}>
                    <div className="text-3xl md:text-4xl font-light text-stone-900 dark:text-stone-100 uppercase tabular-nums">
                      <Counter
                        target={s.n}
                        suffix={s.suffix}
                        duration={2200 + i * 350}
                      />
                    </div>
                    <div className="text-[10px] tracking-widest text-stone-400 dark:text-stone-500 uppercase mt-1">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>

            {/* CTA */}
            <FadeInSection delay={600}>
              <button className="group inline-flex items-center space-x-3 bg-red-900 hover:bg-red-800 text-white min-w-[240px] h-[56px] px-8 justify-center rounded-none transition-all duration-300 tracking-widest uppercase text-xs">
                <span>Book a Studio Tour</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
