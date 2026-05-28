"use client";

import React from "react";
import { Award, Users, Leaf, Clock } from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: Award,
    title: "Heritage Excellence",
    description: "Two decades of mastery in precision printing.",
  },
  {
    icon: Users,
    title: "Trusted Globally",
    description: "The preferred choice for over 50,000 clients.",
  },
  {
    icon: Leaf,
    title: "Ethical Sourcing",
    description: "Sustainable materials and eco-conscious practices.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "Seamless logistics without compromising quality.",
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section className="py-28 bg-[#FCFBF9] dark:bg-[#0f111a]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Visual Composition: Sharp & Editorial */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 pt-12">
                <div className="relative overflow-hidden border border-stone-200 dark:border-stone-700">
                  <img
                    src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&q=80"
                    alt="Printing workshop"
                    className="w-full aspect-[3/4] object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              <div className="col-span-5">
                <div className="relative overflow-hidden border border-stone-200 dark:border-stone-700 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80"
                    alt="Premium paper"
                    className="w-full aspect-square object-cover grayscale-[30%]"
                  />
                </div>
                <div className="relative overflow-hidden border border-stone-200 dark:border-stone-700">
                  <img
                    src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
                    alt="Wedding card"
                    className="w-full aspect-[4/5] object-cover grayscale-[30%]"
                  />
                </div>
              </div>
            </div>

            {/* Subtle Stat Overlay */}
            <div className="absolute -bottom-8 -left-8 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 p-8 hidden md:block">
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2">
                Established
              </p>
              <p className="font-serif text-5xl">1984</p>
            </div>
          </div>

          {/* Content Section: Refined Typography */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
                <span className="text-[10px] font-bold tracking-[0.4em] text-stone-400 dark:text-stone-500 uppercase">
                  Legacy & Craft
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 leading-tight">
                Crafting{" "}
                <span className="italic text-red-800 font-light">Dreams</span>{" "}
                <br />
                into Tangible Reality.
              </h2>

              <div className="space-y-4 max-w-xl">
                <p className="text-stone-600 leading-relaxed font-light">
                  For over two decades, Samlason Printing has served as a
                  cornerstone of quality in the printing industry. What began as
                  a dedicated family studio has evolved into a premier
                  destination for those who value the tactile beauty of ink on
                  paper.
                </p>
                <p className="text-stone-500 text-sm italic border-l-2 border-stone-200 pl-4">
                  "Every print is an artifact of a memory yet to be made."
                </p>
              </div>
            </div>

            {/* Features: Minimalist List */}
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pt-8 border-t border-stone-100">
              {features.map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="h-4 w-4 text-red-400 group-hover:text-stone-900 transition-colors" />
                    <h3 className="text-xs font-bold tracking-widest text-stone-900 dark:text-stone-100 uppercase">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
