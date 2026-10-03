"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "signup";

interface AuthAside {
  image: string;
  imageAlt: string;
  eyebrow: string;
  /** Rendered as the serif headline; use <em> for the accented fragment. */
  title: React.ReactNode;
  description: string;
  stats: { value: string; label: string }[];
}

interface AuthShellProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  aside: AuthAside;
  children: React.ReactNode;
}

const TABS: { mode: AuthMode; label: string }[] = [
  { mode: "login", label: "Sign In" },
  { mode: "signup", label: "Create Account" },
];

export default function AuthShell({
  mode,
  onModeChange,
  aside,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* ── Ambient background wash (mirrors the hero's tinted side panel) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-card lg:block" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Top bar: wordmark + back link ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          aria-label="Ink of Memories, go to home page"
          className="rounded-none font-sans text-lg font-semibold tracking-wider text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-muted-foreground/70 dark:hover:text-brand"
        >
          INK <span className="text-primary">OF</span> MEMORIES
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-none text-[10px] font-semibold text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-muted-foreground dark:hover:text-brand"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
          />
          Back to Home
        </Link>
      </header>
<div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-4 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pb-24">
        {/* ───────── Editorial panel (desktop only) ───────── */}
        <aside className="hidden lg:col-span-6 lg:block xl:col-span-7">
          <div className="sticky top-24 grid grid-cols-12 gap-8">
            <div className="col-span-7 space-y-7 self-center">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-gold"
                />
                <span className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground">
                  {aside.eyebrow}
                </span>
              </div>

              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight xl:text-5xl">
                {aside.title}
              </h1>

              <p className="max-w-md text-sm font-normal leading-[1.9] text-muted-foreground dark:text-muted-foreground/70">
                {aside.description}
              </p>

              <dl className="grid max-w-md grid-cols-3 border-t border-border pt-6 dark:border-border">
                {aside.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={
                      i > 0
                        ? "border-l border-border pl-5 dark:border-border"
                        : undefined
                    }
                  >
                    <dd className="font-sans text-2xl font-normal uppercase tabular-nums text-foreground dark:text-muted-foreground/70">
                      {stat.value}
                    </dd>
                    <dt className="mt-1.5 text-[9px] text-muted-foreground dark:text-muted-foreground">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
{/* Image composition with offset outline frame */}
            <div className="relative col-span-5">
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 h-full w-full border border-gold/40 dark:border-gold/50"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted dark:bg-card">
                <Image
                  src={aside.image}
                  alt={aside.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 22vw, 24vw"
                  className="object-cover grayscale-[20%]"
                  priority
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ───────── Form panel ───────── */}
        <main className="lg:col-span-6 xl:col-span-5">
          <div className="mx-auto w-full max-w-md">
            {/* Segmented mode switcher */}
            <div
              role="tablist"
              aria-label="Authentication mode"
              className="mb-10 grid grid-cols-2 border border-border dark:border-border"
            >
              {TABS.map(({ mode: tabMode, label }) => {
                const active = tabMode === mode;
                return (
                  <button
                    key={tabMode}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => onModeChange(tabMode)}
                    className={cn(
                      "relative px-4 py-4 text-[11px] font-semibold transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                      active
                        ? "bg-footer text-footer-foreground dark:bg-muted dark:text-foreground"
                        : "text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-muted-foreground/70",
                    )}
                  >
                    {label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-gold"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}