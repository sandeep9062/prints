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
    <div className="relative min-h-screen overflow-hidden bg-[#FCFBF9] text-stone-900 dark:bg-[#0f111a] dark:text-stone-100">
      {/* ── Ambient background wash (mirrors the hero's tinted side panel) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#F4F1EE] lg:block dark:bg-[#0d1321]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-700" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-700" />
      </div>

      {/* ── Top bar: wordmark + back link ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          aria-label="Ink of Memories, go to home page"
          className="rounded-none font-serif text-lg tracking-tight text-stone-900 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:text-stone-100 dark:hover:text-red-600"
        >
          Ink<span className="text-red-800 dark:text-red-600">.</span>Memories
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-none text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:text-stone-400 dark:hover:text-red-600"
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
                  className="h-px w-10 bg-red-800 dark:bg-red-600"
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                  {aside.eyebrow}
                </span>
              </div>

              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight xl:text-5xl">
                {aside.title}
              </h1>

              <p className="max-w-md text-sm font-light leading-[1.9] text-stone-600 dark:text-stone-300">
                {aside.description}
              </p>

              <dl className="grid max-w-md grid-cols-3 border-t border-stone-200 pt-6 dark:border-stone-700">
                {aside.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={
                      i > 0
                        ? "border-l border-stone-200 pl-5 dark:border-stone-700"
                        : undefined
                    }
                  >
                    <dd className="font-serif text-2xl font-light uppercase tabular-nums text-stone-900 dark:text-stone-100">
                      {stat.value}
                    </dd>
                    <dt className="mt-1.5 text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
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
                className="absolute -right-4 -top-4 h-full w-full border border-red-200 dark:border-red-800/70"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
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
              className="mb-10 grid grid-cols-2 border border-stone-200 dark:border-stone-700"
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
                      "relative px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-800",
                      active
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
                    )}
                  >
                    {label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-red-800 dark:bg-red-600"
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