"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-16 min-h-[60vh] flex items-center bg-[#FCFBF9] dark:bg-[#0f111a] overflow-hidden">
      {/* Sophisticated Background Detail */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F4F1EE] dark:bg-[#0d1321]" />
        {/* Subtle grid pattern or texture could go here */}
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center space-x-3">
              <span className="h-[1px] w-8 bg-stone-400 dark:bg-stone-600" />
              <span className="text-xs font-semibold tracking-[0.3em] text-stone-500 dark:text-stone-400 uppercase">
                Est. 1984 — Premier Print Studio
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 leading-[1.1] tracking-tight">
              Timeless <br />
              <span className="italic font-light text-red-800 dark:text-red-600">
                Artistry
              </span>{" "}
              in Paper.
            </h1>

            <p className="text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed font-light">
              We specialize in bespoke wedding stationery and luxury print
              solutions crafted with meticulous attention to detail and heritage
              techniques.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/products">
                <Button
                  className="bg-red-900 hover:bg-red-800 text-white 
                  min-w-[220px] h-[56px] px-8 justify-center rounded-none transition-all duration-300 tracking-widest uppercase text-xs"
                >
                  View Collection
                </Button>
              </Link>

              <Link href="/customize">
                <Button
                  variant="outline"
                  className="border-red-200 dark:border-red-800 text-red-900 dark:text-red-400 hover:bg-red-900 hover:text-white 
                  min-w-[220px] h-[56px] px-8 justify-center rounded-none transition-all duration-300 tracking-widest uppercase text-xs"
                >
                  Private Consultation
                </Button>
              </Link>
            </div>

            {/* Minimalist Stats */}
            <div className="flex gap-12 pt-6 border-t border-stone-200 dark:border-stone-700">
              {[
                { value: "20", label: "Years" },
                { value: "50k", label: "Clients" },
                { value: "100+", label: "Originals" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-light text-stone-900 dark:text-stone-100 uppercase">
                    {stat.value}
                  </p>
                  <p className="text-[10px] tracking-widest text-stone-400 dark:text-stone-500 uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-stone-200 dark:bg-stone-800 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80"
                alt="Luxury Wedding Stationery"
                className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Detail Image */}
            <div className="absolute -bottom-8 -left-8 hidden xl:block w-36 h-48 border-[8px] border-white dark:border-stone-900 shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
                alt="Detail close up"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
