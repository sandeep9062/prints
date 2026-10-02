"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/*
  Design notes
  - Matches the hero: bottle-green desk (#1F3A32), paper stocks, foil gold
    (#D2AE62 on dark, #B08D4A on paper), wax-rose seals.
  - Each review is a stationery card on its own paper stock (bone, blush,
    mist, midnight). The avatar is a wax seal with the client's initials.
  - Autoplay can be paused (WCAG 2.2.2) and is off under reduced motion.
*/

interface Testimonial {
  id: number;
  name: string;
  event: string;
  product: string;
  content: string;
  rating: number;
}

// Sample reviews: replace with your real customer feedback before launch.
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya & Rahul",
    event: "Wedding, Mumbai",
    product: "Wedding invitations",
    content:
      "The wedding cards were absolutely stunning. Every guest complimented the design and the quality of the paper. Samlason made our special day even more memorable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Anjali Sharma",
    event: "Corporate event, Delhi",
    product: "Brochures and visiting cards",
    content:
      "Professional service and exceptional quality. The brochures and visiting cards lifted our brand image right away. Highly recommended.",
    rating: 5,
  },
  {
    id: 3,
    name: "Vikram & Sneha",
    event: "Wedding, Bangalore",
    product: "Custom invitation suite",
    content:
      "We were amazed by the attention to detail and the finish. The customisation options helped us create exactly the invitation we had imagined.",
    rating: 5,
  },
  {
    id: 4,
    name: "Meera Iyer",
    event: "Housewarming, Chennai",
    product: "Shagun envelopes",
    content:
      "I ordered velvet shagun envelopes for the family and they felt so premium. The colours matched my sample perfectly and they arrived two days early.",
    rating: 5,
  },
  {
    id: 5,
    name: "Arjun Malhotra",
    event: "Startup launch, Gurugram",
    product: "Executive business cards",
    content:
      "Our founders' cards got more compliments than our pitch deck. Clean typography, thick stock, and zero mistakes on a 500-card order.",
    rating: 5,
  },
  {
    id: 6,
    name: "Kavya & Nikhil",
    event: "Wedding, Jaipur",
    product: "Wedding invitations",
    content:
      "They guided us on paper and foil choices and never pushed the expensive option. The final cards looked even better than the proofs.",
    rating: 5,
  },
  {
    id: 7,
    name: "Rohan Deshmukh",
    event: "Family album, Pune",
    product: "Hardcover photo book",
    content:
      "The coffee table book of our anniversary photos is the best gift I've given. Colours are rich, binding is solid, and it looks like it came from a gallery.",
    rating: 5,
  },
  {
    id: 8,
    name: "Sana Qureshi",
    event: "Conference, Hyderabad",
    product: "Bulk brochures",
    content:
      "We needed 2,000 brochures on a tight deadline. The team kept us updated at every step and delivered on time with consistent print quality.",
    rating: 4,
  },
];

// Paper stocks, cycled across the cards
const PAPERS = [
  {
    card: "#F7F4EE",
    ink: "#1F3A32",
    muted: "#4F655D",
    rule: "#B08D4A",
    star: "#B08D4A",
  },
  {
    card: "#F4E4E0",
    ink: "#1F3A32",
    muted: "#5B5A55",
    rule: "#B08D4A",
    star: "#B08D4A",
  },
  {
    card: "#E3EAEF",
    ink: "#1F3A32",
    muted: "#4F655D",
    rule: "#B08D4A",
    star: "#B08D4A",
  },
  {
    card: "#2A463C",
    ink: "#F3EBDD",
    muted: "#C9D3CC",
    rule: "#D2AE62",
    star: "#D2AE62",
  },
] as const;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const AUTOPLAY_DELAY = 5500;
const EASE = [0.22, 1, 0.36, 1] as const;

const navBtn =
  "flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E9DD]/40 " +
  "text-[#F7F4EE] transition-colors duration-300 hover:bg-[#F7F4EE] hover:text-[#1F3A32] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2AE62] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F3A32] dark:focus-visible:ring-offset-[#121C18] " +
  "active:scale-95 motion-reduce:transition-none";

const initials = (name: string) =>
  name
    .split(/\s*&\s*|\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const WaxSeal = ({ text }: { text: string }) => (
  <span
    aria-hidden="true"
    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-base italic text-[#8E3D3D]"
    style={{
      background:
        "radial-gradient(circle at 35% 30%,#C26666 0,#A24B4B 45%,#7E3535 100%)",
      boxShadow: "0 4px 8px -3px rgba(0,0,0,.5)",
      textShadow: "0 1px 0 rgba(255,255,255,.25), 0 -1px 0 rgba(0,0,0,.35)",
    }}
  >
    <span className="absolute inset-1.5 rounded-full border border-[#E9B5B5]/40" />
    {text}
  </span>
);

export const TestimonialsSection = () => {
  const total = testimonials.length;
  const reduceMotion = useReducedMotion();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const userPausedRef = useRef(false);
  const inViewRef = useRef(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startLeft: 0,
    moved: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const average = useMemo(
    () => (testimonials.reduce((a, t) => a + t.rating, 0) / total).toFixed(1),
    [total],
  );

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const pauseFor = useCallback((ms = 8000) => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  }, []);

  const slide = useCallback(
    (dir: 1 | -1) => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (dir === 1 && el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir === -1 && el.scrollLeft <= 4) {
        el.scrollTo({ left: max, behavior: "smooth" });
      } else {
        el.scrollBy({ left: dir * getStep(), behavior: "smooth" });
      }
    },
    [getStep],
  );

  const goPrev = useCallback(() => {
    pauseFor();
    slide(-1);
  }, [slide, pauseFor]);

  const goNext = useCallback(() => {
    pauseFor();
    slide(1);
  }, [slide, pauseFor]);

  const toggleAutoplay = () => {
    const next = !playing;
    userPausedRef.current = !next;
    setPlaying(next);
  };

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 1;
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${Math.max(ratio, 0.04)})`;
    }
    const step = getStep();
    if (step)
      setActiveIndex(Math.min(total - 1, Math.round(el.scrollLeft / step)));
  }, [getStep, total]);

  // Autoplay (never under reduced motion)
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      if (
        pausedRef.current ||
        userPausedRef.current ||
        !inViewRef.current ||
        document.hidden
      )
        return;
      slide(1);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [slide, reduceMotion]);

  // Only autoplay while visible
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mouse drag (touch uses native scrolling)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startLeft = el.scrollLeft;
    pausedRef.current = true;
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - d.startX;
      if (Math.abs(dx) > 5) d.moved = true;
      el.scrollLeft = d.startLeft - dx;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      d.active = false;
      el.style.cursor = "";
      const step = getStep();
      if (step && d.moved) {
        el.scrollTo({
          left: Math.round(el.scrollLeft / step) * step,
          behavior: "smooth",
        });
      }
      setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 400);
      pauseFor();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <section
      aria-label="Customer testimonials"
      className="relative overflow-hidden bg-[#1F3A32] py-20 md:py-28 dark:bg-[#121C18]"
    >
      {/* Paper grain over the desk */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-[#F7F4EE] sm:text-5xl md:text-6xl">
              What our customers say
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-7 text-[#E4E9DD]/80">
              Couples, founders and families who trusted Samlason with the
              pieces that matter most.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#D2AE62] text-[#D2AE62]"
                  />
                ))}
              </div>
              <span className="text-sm text-[#E4E9DD]/80">
                {average} average from {total} reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!reduceMotion && (
              <button
                type="button"
                onClick={toggleAutoplay}
                aria-label={playing ? "Pause autoplay" : "Start autoplay"}
                className={navBtn}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonials"
              className={navBtn}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonials"
              className={navBtn}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          tabIndex={0}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onDragStart={(e) => e.preventDefault()}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => {
            if (!dragRef.current.active) pausedRef.current = false;
          }}
          onFocus={() => (pausedRef.current = true)}
          onBlur={() => (pausedRef.current = false)}
          onTouchStart={() => pauseFor()}
          onKeyDown={onKeyDown}
          className="-mx-5 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-10 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2AE62] [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 xl:mx-0 xl:scroll-px-0 xl:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, index) => {
            const paper = PAPERS[index % PAPERS.length];
            return (
              <motion.figure
                key={t.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 24, rotate: 1.5 }
                }
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.7,
                  delay: Math.min(index * 0.08, 0.3),
                  ease: EASE,
                }}
                className="relative flex min-h-[340px] w-[86%] shrink-0 snap-start select-none flex-col justify-between rounded-sm p-8 shadow-[0_24px_48px_-24px_rgba(0,0,0,.65)] sm:w-[52%] md:p-10 lg:w-[calc((100%-48px)/3)]"
                style={{ backgroundColor: paper.card, color: paper.ink }}
              >
                {/* Grain + double rule */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-sm opacity-[.2] mix-blend-multiply"
                  style={{ backgroundImage: GRAIN }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border"
                  style={{ borderColor: paper.rule }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 border opacity-50"
                  style={{ borderColor: paper.rule }}
                />

                <div className="relative">
                  <div
                    className="mb-5 flex gap-0.5"
                    role="img"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{
                          color: paper.star,
                          fill: i < t.rating ? paper.star : "transparent",
                          opacity: i < t.rating ? 1 : 0.35,
                        }}
                      />
                    ))}
                  </div>

                  <blockquote className="font-serif text-xl leading-8">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                </div>

                <figcaption className="relative mt-8 flex items-center gap-4">
                  <WaxSeal text={initials(t.name)} />
                  <span className="min-w-0">
                    <span className="block font-serif text-lg font-medium leading-tight">
                      {t.name}
                    </span>
                    <span
                      className="mt-1 block text-sm leading-snug"
                      style={{ color: paper.muted }}
                    >
                      {t.product}
                    </span>
                    <span
                      className="block text-sm leading-snug"
                      style={{ color: paper.muted }}
                    >
                      {t.event}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-2 flex items-center gap-5">
          <div
            role="progressbar"
            aria-label="Slider progress"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={activeIndex + 1}
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[#E4E9DD]/20"
          >
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left bg-[#D2AE62] transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: "scaleX(0.04)" }}
            />
          </div>
          <span className="font-serif text-base tabular-nums text-[#E4E9DD]/80">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};
