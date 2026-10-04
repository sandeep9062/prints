/**
 * Root loading UI — the skeleton shown while a route segment is being fetched.
 *
 * A root `loading.tsx` applies to every route without a nearer one. It only
 * covers the *initial* page load; client-side navigations that already have
 * layout state use their own Suspense boundaries. `motion-reduce` disables the
 * pulse so the reduced-motion preference is respected.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-lg px-6 text-center">
        {/* Press-rule motif, echoing the gold hairline used across the site. */}
        <div className="mx-auto h-px w-16 bg-gold" />

        <div
          className="mx-auto mt-8 h-10 w-10 animate-pulse rounded-full bg-brand/15 motion-reduce:animate-none"
          aria-hidden="true"
        />

        <p className="mt-6 font-serif text-2xl tracking-tight text-foreground">
          Setting the press
          <span className="sr-only"> — loading, please wait</span>
        </p>

        <p className="mt-2 text-[13px] text-muted-foreground">
          One moment while we prepare this page.
        </p>
      </div>
    </div>
  );
}