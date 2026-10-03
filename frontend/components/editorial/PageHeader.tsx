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
        "border-b border-border pb-10",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-gold" />
        <span className="text-[10px] font-semibold text-muted-foreground">
          {eyebrow}
        </span>
      </div>

      <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl dark:text-foreground">
        {title}{" "}
        <em className="font-medium text-brand">{accent}</em>
      </h1>

      {description && (
        <p className="mt-6 max-w-2xl text-base font-normal leading-[1.8] text-muted-foreground">
          {description}
        </p>
      )}

      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}