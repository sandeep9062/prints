import { cn } from "@/lib/utils";

/**
 * Shared editorial page header.
 *
 * Follows the homepage's print-atelier language: a red tick rule + tracked
 * eyebrow, a serif headline with an italic accent, and a hairline rule beneath.
 * Used by /about-us, /contact and /blog so those pages read as one system.
 */
export default function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  className,
  children,
}: {
  eyebrow: string;
  /** Leading part of the headline. */
  title: string;
  /** Rendered inside <em> — the red italic fragment. */
  accent: string;
  description?: string;
  className?: string;
  /** Optional slot rendered under the description (e.g. social links). */
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "border-b border-stone-200 pb-10 dark:border-stone-700",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-red-800 dark:bg-red-600" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
          {eyebrow}
        </span>
      </div>

      <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-stone-900 md:text-5xl lg:text-6xl dark:text-stone-100">
        {title}{" "}
        <em className="font-light text-red-800 dark:text-red-600">{accent}</em>
      </h1>

      {description && (
        <p className="mt-6 max-w-2xl text-base font-light leading-[1.8] text-stone-600 dark:text-stone-300">
          {description}
        </p>
      )}

      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}