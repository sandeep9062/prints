/**
 * Smooth-scroll helpers that prefer the global Lenis instance
 * (created by <SmoothScroll />) and fall back to native scrolling.
 *
 * Centralising this keeps every "back to top" / step-change button
 * consistent: one easing curve, one duration, no fighting between
 * `window.scrollTo({behavior:"smooth"})` and Lenis.
 */

declare global {
  // Single source of truth for the Lenis handle (see SmoothScroll.tsx,
  // which assigns the real Lenis instance to this slot).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __lenis?: { scrollTo: (...args: any[]) => void } | null;
  }
}

const EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToTop(duration = 1.4): void {
  if (typeof window === "undefined") return;
  const lenis = window.__lenis;
  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(0, { duration, easing: EASING });
    return;
  }
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/** Scroll to an element (selector or node), offset for the fixed navbar. */
export function scrollToElement(
  target: string | HTMLElement,
  duration = 1.2,
): void {
  if (typeof window === "undefined") return;
  const lenis = window.__lenis;
  const navOffset =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height",
      ),
    ) || 0;
  const offset = -(navOffset + 12);

  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(target, { offset, duration, easing: EASING });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}
