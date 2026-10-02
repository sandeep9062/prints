"use client";

import React from "react";
import { Award, Users, Leaf, Clock } from "lucide-react";

/*
  Design notes
  - Blush paper section in the same system as the other sections: bottle-green
    ink, foil-gold accents.
  - The photos are loose prints with captions, slightly rotated. The Atelier
    section already uses the "press sheet" frame, so this one stays different.
*/

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: Award,
    title: "Heritage excellence",
    description: "Two decades of mastery in precision printing.",
  },
  {
    icon: Users,
    title: "Trusted globally",
    description: "The preferred choice for over 50,000 clients.",
  },
  {
    icon: Leaf,
    title: "Ethical sourcing",
    description: "Sustainable materials and eco-conscious practices.",
  },
  {
    icon: Clock,
    title: "Timely delivery",
    description: "Seamless logistics without compromising quality.",
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const Print = ({
  src,
  alt,
  caption,
  aspect,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  className: string;
}) => (
  <figure
    className={`absolute rounded-sm bg-[#F7F4EE] p-2.5 pb-9 shadow-[0_24px_48px_-24px_rgba(31,58,50,.6)] ${className}`}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-full object-cover ${aspect}`}
    />
    <figcaption className="absolute inset-x-0 bottom-2.5 text-center font-serif text-sm italic text-[#1F3A32]/70">
      {caption}
    </figcaption>
  </figure>
);

export const AboutSection: React.FC = () => {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-[#F4E8E4] py-24 dark:bg-[#16211D] lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-multiply dark:hidden"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Loose prints */}
          <div className="relative mx-auto h-[500px] w-full max-w-[560px] sm:h-[600px] lg:col-span-6 lg:max-w-none">
            <Print
              src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&q=80"
              alt="Printing workshop"
              caption="The workshop"
              aspect="aspect-[3/4]"
              className="left-0 top-6 w-[62%] -rotate-2"
            />
            <Print
              src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80"
              alt="Premium paper"
              caption="Paper stock"
              aspect="aspect-square"
              className="right-0 top-0 w-[40%] rotate-3"
            />
            <Print
              src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
              alt="Wedding card"
              caption="Finished invitation"
              aspect="aspect-[4/5]"
              className="bottom-0 right-4 w-[44%] -rotate-1"
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-6">
            <h2
              id="about-heading"
              className="max-w-[16ch] font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#1F3A32] dark:text-[#F7F4EE] md:text-6xl lg:text-7xl"
            >
              Crafting dreams into tangible reality.
            </h2>

            <div className="mt-8 max-w-[54ch] space-y-6">
              <p className="text-base leading-[1.75] text-[#1F3A32]/80 dark:text-[#E4E9DD]/80 md:text-lg">
                For over two decades, Samlason Printing has served as a
                cornerstone of quality in the printing industry. What began as a
                dedicated family studio has evolved into a premier destination
                for those who value the tactile beauty of ink on paper.
              </p>
              <p className="border-l-2 border-[#B08D4A] pl-5 font-serif text-xl italic text-[#1F3A32] dark:text-[#F7F4EE]">
                &ldquo;Every print is an artifact of a memory yet to be
                made.&rdquo;
              </p>
            </div>

            {/* Features */}
            <ul className="mt-12 grid gap-x-10 gap-y-8 border-t border-[#1F3A32]/20 pt-8 dark:border-[#E4E9DD]/20 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature.title}>
                  <div className="flex items-center gap-3">
                    <feature.icon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#B08D4A]"
                    />
                    <h3 className="font-serif text-xl font-medium text-[#1F3A32] dark:text-[#F7F4EE]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-[#1F3A32]/75 dark:text-[#E4E9DD]/75">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
