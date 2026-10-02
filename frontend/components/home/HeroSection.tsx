"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "20", label: "Years" },
  { value: "50k", label: "Clients" },
  { value: "100+", label: "Originals" },
];

export const HeroSection: React.FC = () => {
  return (
    // The Navbar is position:fixed and reserves no flow space, so the hero
    // clears it using --navbar-height (defined in globals.css) + breathing room.
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-[#FCFBF9] pt-[calc(var(--navbar-height)+1.5rem)] pb-20 dark:bg-[#0f111a] lg:pt-[calc(var(--navbar-height)+3rem)] lg:pb-28"
    >
      {/* Background detail: tinted side panel + soft paper glow */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 hidden h-full w-[38%] bg-[#F4F1EE] dark:bg-[#0d1321] lg:block" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-700" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-700" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Text Content */}
          <div className="space-y-8 lg:col-span-7 lg:pr-8">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-red-800 dark:bg-red-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                Est. 1984 — Premier Print Studio
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-serif text-5xl leading-[1.05] tracking-tight text-stone-900 dark:text-stone-100 md:text-6xl lg:text-7xl"
            >
              Timeless <br />
              <span className="font-light italic text-red-800 dark:text-red-600">
                Artistry
              </span>{" "}
              in Paper.
            </h1>

            <p className="max-w-xl text-base font-light leading-[1.8] text-stone-600 dark:text-stone-300 md:text-lg">
              We specialize in bespoke wedding stationery and luxury print
              solutions crafted with meticulous attention to detail and heritage
              techniques.
            </p>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-5">
              <Button
                asChild
                className="group h-14 min-w-[220px] justify-center gap-3 rounded-none bg-red-900 px-8 text-xs uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/30 focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-offset-[#0f111a]"
              >
                <Link href="/products">
                  View Collection
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 min-w-[220px] justify-center rounded-none border-red-200 bg-transparent px-8 text-xs uppercase tracking-widest text-red-900 transition-all duration-300 hover:border-red-900 hover:bg-red-900 hover:text-white focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-red-800 dark:text-red-400 dark:focus-visible:ring-offset-[#0f111a]"
              >
                <Link href="/customize">Private Consultation</Link>
              </Button>
            </div>

            {/* Stats */}
            <dl className="mt-4 grid max-w-md grid-cols-3 border-t border-stone-200 pt-8 dark:border-stone-700">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={
                    i > 0
                      ? "border-l border-stone-200 pl-6 dark:border-stone-700"
                      : ""
                  }
                >
                  <dd className="font-serif text-3xl font-light uppercase tabular-nums text-stone-900 dark:text-stone-100">
                    {stat.value}
                  </dd>
                  <dt className="mt-1.5 text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Editorial Image Composition */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            {/* Offset outline frame behind the main image */}
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full border border-red-200 dark:border-red-800 sm:-right-6 sm:-top-6"
            />

            <div className="group relative aspect-[4/5] w-full overflow-hidden bg-stone-200 shadow-2xl shadow-stone-900/20 dark:bg-stone-800 dark:shadow-black/40">
              <img
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80"
                alt="Luxury wedding stationery laid out on a table"
                width={800}
                height={1000}
                fetchPriority="high"
                className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {/* Soft inner vignette for depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
              />
            </div>

            {/* Floating Detail Image */}
            <div className="absolute -bottom-10 -left-10 hidden h-48 w-36 overflow-hidden border-[8px] border-white shadow-xl dark:border-stone-900 xl:block">
              <img
                src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
                alt="Close-up detail of printed stationery"
                width={400}
                height={533}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
