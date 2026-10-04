"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useGetProductsQuery } from "@/services/productsApi";
import { ProductCard } from "./ProductCard";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  /** Always true here (the carousel filters on it) — renders the Featured tag. */
  featured?: boolean;
  minQuantity?: number;
  stock?: number;
};

type ApiProduct = {
  _id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  badge?: string;
  featured?: boolean;
  minQuantity?: number;
  stock?: number;
};

const AUTOPLAY_DELAY = 4500;
const EASE = [0.22, 1, 0.36, 1] as const;

const navBtn =
  "flex h-11 w-11 items-center justify-center rounded-full border border-border " +
  "bg-card text-foreground transition-colors duration-300 " +
  "hover:border-brand hover:text-primary-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "active:scale-95 " +
  "motion-reduce:transition-none";

const FeaturedSkeleton = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-6">
      <div className="mb-12 space-y-4">
        <div className="h-12 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={i > 1 ? "hidden lg:block" : ""}>
            <div className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FeaturedProducts = () => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const reduceMotion = useReducedMotion();

  const featuredProducts: ProductCardProps[] = useMemo(
    () =>
      (data?.products || [])
        .filter((p: ApiProduct) => p.featured)
        .map((p: ApiProduct) => ({
          id: p._id,
          slug: p.slug || p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice:
            p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
          image: p.images?.[0] || "/placeholder.svg",
          badge: p.badge,
          featured: p.featured,
          minQuantity: p.minQuantity,
          stock: p.stock,
        })),
    [data],
  );

  const total = featuredProducts.length;

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
      const step = getStep();
      const max = el.scrollWidth - el.clientWidth;
      if (dir === 1 && el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir === -1 && el.scrollLeft <= 4) {
        el.scrollTo({ left: max, behavior: "smooth" });
      } else {
        el.scrollBy({ left: dir * step, behavior: "smooth" });
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

  // Progress bar + counter follow the scroll position
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

  // Autoplay
  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => {
      if (pausedRef.current || !inViewRef.current || document.hidden) return;
      slide(1);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [total, slide]);

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
  }, [total]);

  // Mouse drag (touch uses native scrolling)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startLeft: 0,
    moved: false,
  });

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
      // re-enable snapping once the settle animation has begun
      setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 400);
      pauseFor();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  // Don't follow a link when the gesture was a drag
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  if (isLoading) return <FeaturedSkeleton />;
  if (isError || !total) return null;

  return (
    <section
      aria-label="Featured collection"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-brand-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gold/30 blur-3xl dark:bg-footer/20"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              The featured collection
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground">
              A carefully selected edit of pieces made to bring a little more
              character, craft, and meaning to every occasion.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 md:justify-end">
            <Link
              href="/products"
              className="group -my-2 inline-flex items-center gap-2 border-b border-foreground/40 px-1 py-2 text-sm font-medium text-foreground transition-colors duration-300 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              Browse all products
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous featured products"
                className={navBtn}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next featured products"
                className={navBtn}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Slider */}
        <div
          ref={scrollerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured products"
          tabIndex={0}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => {
            if (!dragRef.current.active) pausedRef.current = false;
          }}
          onTouchStart={() => pauseFor()}
          onKeyDown={onKeyDown}
          className="-mx-5 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 outline-none [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 sm:gap-6 xl:mx-0 xl:px-0 xl:scroll-px-0 [&::-webkit-scrollbar]:hidden [&_a]:[-webkit-user-drag:none] [&_img]:pointer-events-none [&_img]:[-webkit-user-drag:none]"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: Math.min(index * 0.07, 0.35),
                ease: EASE,
              }}
              className="w-[78%] shrink-0 snap-start sm:w-[44%] md:w-[36%] lg:w-[29%] xl:w-[calc((100%-72px)/4)]"
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-10 flex items-center gap-5">
          <div
            role="progressbar"
            aria-label="Slider progress"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={activeIndex + 1}
            className="relative h-px flex-1 overflow-hidden bg-border"
          >
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left bg-brand transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: "scaleX(0.04)" }}
            />
          </div>

          <span className="tabular-nums text-sm text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};
