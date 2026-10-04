"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * How long a frame holds before the card advances on its own. Close enough to
 * the featured / new-arrivals rails (4500ms) that the page feels like one
 * system, while a card still feels livelier than a full-width rail.
 */
const AUTOPLAY_MS = 4000;

/**
 * Same easing the home rails animate with, so the motion vocabulary doesn't
 * change when a card scrolls into the same viewport as a rail.
 */
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Frames are warmed a couple ahead rather than all at once: preloading every
 * image of every card in a 24-up grid would cost far more bandwidth than the
 * couple of kilobytes it saves on the first rotation.
 */
const PRELOAD_AHEAD = 2;

type ProductImageSlideshowProps = {
  /** All uploaded frames, in merchant order. */
  images: string[];
  /** Cover frame, used when `images` is empty or missing the primary shot. */
  fallback: string;
  /** Product name — every frame's alt text, as they all depict the product. */
  name: string;
  /** Position in the list. Drives eager vs lazy loading. */
  index: number;
};

/**
 * Renders every uploaded frame of a product on the card and cycles through them
 * automatically.
 *
 * Behaviour
 *  - Advances on a timer, but only while the card is actually on screen
 *    (IntersectionObserver). A catalogue grid mounts dozens of cards at once,
 *    and off-screen ones burning timers is the difference between a smooth
 *    scroll and a janky one.
 *  - Pauses on hover and on keyboard focus, so the frame stops moving while the
 *    shopper is reaching for the wishlist / compare / add-to-cart rail or a dot.
 *  - Honours `prefers-reduced-motion`: no autoplay and no sliding, dots only.
 *  - Falls back to a single static frame when a product has one image (or none
 *    beyond the cover), so single-image cards pay for none of this.
 */
export const ProductImageSlideshow = ({
  images,
  fallback,
  name,
  index,
}: ProductImageSlideshowProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  /*
   * Dedupe and drop blanks: an admin can upload the same shot twice, and an
   * empty string in the array would otherwise render as a broken frame the
   * carousel happily advances to. `fallback` is forced to the front so the
   * cover the rest of the card already agreed on (compare row, cart line,
   * schema.org) is also the frame a shopper sees first.
   */
  const slides = useMemo(() => {
    const seen = new Set<string>();
    return [fallback, ...images].filter((src) => {
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  }, [fallback, images]);

  const count = slides.length;
  const isCarousel = count > 1;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  /*
   * Seeded optimistically where there is no IntersectionObserver to ask:
   * without it the rotation is the part of the card that silently never runs,
   * and it is the whole point of this component. Everywhere else the observer
   * below corrects this on its first callback (typically `false`, since a card
   * can mount off screen).
   */
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  const reduceMotion = useReducedMotion();

  // Guard against a product's images being edited while its card is mounted:
  // `active` can outlive the frame it pointed at.
  const current = Math.min(active, count - 1);

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setActive(((next % count) + count) % count);
  };

  /* Autoplay — gated on visibility, hover/focus pause and reduced motion. */
  useEffect(() => {
    if (!isCarousel || paused || reduceMotion || !inView) return;
    const id = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isCarousel, paused, reduceMotion, inView, count]);

  /* Track visibility so off-screen cards aren't animating unseen. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !isCarousel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isCarousel]);

  /*
   * Warm the next frames. Without this the first rotation can land on an image
   * that hasn't finished downloading and flash an empty tile — the image is the
   * first thing on the card a shopper looks at, so that reads as broken.
   */
  useEffect(() => {
    if (!isCarousel || paused || reduceMotion || !inView) return;
    slides.slice(1, 1 + PRELOAD_AHEAD).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [isCarousel, paused, reduceMotion, inView, slides]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onMouseEnter={() => isCarousel && setPaused(true)}
      onMouseLeave={() => isCarousel && setPaused(false)}
      /* Keyboard users get the same courtesy as hover — focus-within covers a
         dot being tabbed to as well as the action rail above it. */
      onFocusCapture={() => isCarousel && setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ x: reduceMotion ? 0 : direction * 100 + "%" }}
          animate={{ x: 0 }}
          exit={{ x: reduceMotion ? 0 : direction * -100 + "%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease: SLIDE_EASE,
          }}
        >
          <img
            src={slides[current]}
            alt={name}
            /* Only the first few cards load their cover eagerly. The remaining
               frames are `lazy` — they're stacked in the same on-screen box, so
               the browser fetches them without delaying a rotation, and
               `loading` keeps them out of the initial critical path. */
            loading={current === 0 && index < 4 ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </motion.div>
      </AnimatePresence>

      {isCarousel && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center gap-1.5 @max-[12rem]:bottom-3 @max-[12rem]:gap-1">
          {slides.map((src, i) => {
            const isActive = i === current;
            return (
              <button
                key={src}
                type="button"
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Show image ${i + 1} of ${count} of ${name}`}
                aria-current={isActive}
                className={cn(
                  "pointer-events-auto h-1.5 rounded-full ring-1 ring-black/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none",
                  isActive
                    ? "w-5 bg-background"
                    : "w-1.5 bg-background/50 hover:bg-background/80",
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};