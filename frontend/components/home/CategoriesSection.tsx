"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: string;
}

const categories: Category[] = [
  {
    id: "wedding-cards",
    name: "Wedding Cards",
    description: "Bespoke invitations for timeless celebrations.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80",
    count: "50 Designs",
  },
  {
    id: "invitation-cards",
    name: "Invitation Cards",
    description: "Sophisticated designs for every milestone.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    count: "40 Designs",
  },
  {
    id: "visiting-cards",
    name: "Visiting Cards",
    description: "Distinctive cards for professional excellence.",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    count: "30 Designs",
  },
  {
    id: "shagun-cards",
    name: "Shagun Cards",
    description: "Traditional envelopes with a modern touch.",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    count: "30 Designs",
  },
  {
    id: "letter-pads",
    name: "Letter Pads",
    description: "Premium stationery for personal and corporate use.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80",
    count: "50 Designs",
  },
  {
    id: "brochures",
    name: "Brochures & Catalogs",
    description: "High-impact layouts for your brand story.",
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
    count: "25 Designs",
  },
];

export const CategoriesSection = () => {
  return (
    <section className="py-20 bg-[#FCFBF9] dark:bg-[#0f111a]">
      <div className="container mx-auto px-6">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-stone-200 dark:border-stone-700">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 dark:text-stone-500 uppercase">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mt-2">
              Browse by Category
            </h2>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xs mt-4 md:mt-0 italic">
            Experience the fusion of heritage craftsmanship and modern printing
            technology.
          </p>
        </div>

        {/* Dense Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group flex flex-col"
            >
              {/* Image: Smaller Aspect Ratio (3:2) for space efficiency */}
              <div className="relative aspect-[3/2] overflow-hidden bg-stone-100 dark:bg-stone-800 mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2 py-1">
                  <span className="text-[10px] font-semibold tracking-widest text-stone-900 dark:text-stone-100 uppercase">
                    {category.count}
                  </span>
                </div>
              </div>

              {/* Text Content: Structured and Minimal */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100 uppercase">
                    {category.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px] leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="pt-1">
                  <ArrowRight className="h-4 w-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-900 dark:group-hover:text-stone-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
