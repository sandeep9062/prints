"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection: React.FC = () => {
  return (
    <section className="py-32 bg-[#FCFBF9] dark:bg-[#0d1321] relative overflow-hidden">
      {/* Sophisticated Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-4 mb-10">
            <span className="h-px w-10 bg-stone-700 dark:bg-stone-500" />
            <span className="text-[10px] font-bold tracking-[0.5em] text-stone-500 dark:text-stone-400 uppercase">
              Bespoke Services
            </span>
            <span className="h-px w-10 bg-stone-700" />
          </div>

          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stone-900 dark:text-white leading-tight mb-8">
            Your Vision, <br />
            <span className="italic text-red-800 dark:text-red-600 font-light">
              Exquisitely
            </span>{" "}
            Rendered.
          </h2>

          <p className="text-stone-400 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            From the first sketch to the final emboss, we partner with you to
            create stationery that resonates. Begin your design consultation
            today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/customize">
              <Button
                className="bg-red-900 hover:bg-red-800 text-white 
                  min-w-[240px] h-[56px] px-8 text-[11px] font-bold rounded-none transition-all duration-300 tracking-widest uppercase text-xs justify-center"
              >
                Begin Customization
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                className="border-red-200 dark:border-red-800 text-red-900 dark:text-red-400 hover:bg-red-900 hover:text-white 
                  min-w-[240px] h-[56px] px-8 text-[11px] font-bold rounded-none transition-all duration-300 tracking-widest uppercase text-xs justify-center"
              >
                Connect With Us
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Subtle footer credit in CTA */}
          <p className="mt-16 text-[9px] tracking-widest text-stone-600 uppercase">
            Handcrafted in our studio since 2004
          </p>
        </div>
      </div>
    </section>
  );
};
