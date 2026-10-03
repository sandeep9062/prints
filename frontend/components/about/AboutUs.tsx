import React from "react";

import { FOUNDED_YEAR, yearsInBusiness } from "@/lib/site-config";

const AboutUs = () => {
  return (
    <div>
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
          {/* Left Side: Heritage image of the studio */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full border border-gold/60 transition-transform duration-500"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted shadow-2xl shadow-foreground/20 dark:shadow-background/60">
              <img
                src="/facility.jpg"
                alt="Inside the Ink of Memories studio"
                loading="lazy"
                className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5 dark:ring-foreground/10"
              />
            </div>
          </div>

          {/* Right Side: Copy */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
                <h3 className="text-[10px] font-semibold text-gold-text dark:text-gold">
                  Our Heritage
                </h3>
              </div>
              <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
                Where Tradition <br /> meets{" "}
                <em className="font-medium text-brand">
                  Technology.
                </em>
              </h2>
            </div>

            <p className="text-base font-normal leading-[1.8] text-muted-foreground">
              Ink of Memories is the digital evolution of our{" "}
              <strong className="font-medium text-foreground">
                Panchkula press, established {FOUNDED_YEAR}
              </strong>
              . For {yearsInBusiness()} years we have combined physical
              craftsmanship with high-end software engineering to create paper
              artifacts that last a lifetime.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
              <div>
                <span className="block font-sans text-2xl font-normal text-foreground">
                  Panchkula
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Physical Studio
                </span>
              </div>
              <div>
                <span className="block font-sans text-2xl font-normal text-foreground">
                  Worldwide
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Digital Atelier
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
