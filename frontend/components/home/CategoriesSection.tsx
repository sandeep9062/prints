"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/*
  Design notes
  - Each category is a photo mounted on a bone card. Wedding cards, the
    flagship, is a large 2x2 tile; the other five fill the grid around it.
  - The photo is decorative (the link text already names the category), so
    alt is empty rather than repeating the name.
*/

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
    <section
      aria-labelledby="categories-heading"
      className="bg-[#E3EAEF] py-24 dark:bg-[#16211D] lg:py-28"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#1F3A32]/20 pb-8 dark:border-[#E4E9DD]/20 md:flex-row md:items-end">
          <h2
            id="categories-heading"
            className="font-serif text-4xl font-medium leading-tight tracking-tight text-[#1F3A32] dark:text-[#F7F4EE] md:text-5xl"
          >
            Browse by category
          </h2>
          <p className="max-w-xs text-base leading-relaxed text-[#1F3A32]/75 dark:text-[#E4E9DD]/75">
            Experience the fusion of heritage craftsmanship and modern printing
            technology.
          </p>
        </div>

        {/* Grid: featured 2x2 tile + five single tiles */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {categories.map((category, index) => {
            const featured = index === 0;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={cn(
                  "group flex flex-col rounded-sm bg-[#F7F4EE] p-3 shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E3EAEF] dark:bg-[#1C2B26] dark:focus-visible:ring-offset-[#16211D]",
                  featured && "sm:col-span-2 lg:row-span-2",
                )}
              >
                <div
                  className={cn(
                    "relative flex-1 overflow-hidden bg-[#D5DCCB] dark:bg-[#22332D]",
                    featured
                      ? "min-h-[280px] lg:min-h-[440px]"
                      : "min-h-[200px]",
                  )}
                >
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="px-2 pb-3 pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3
                      className={cn(
                        "font-serif font-medium text-[#1F3A32] underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-[#B08D4A] dark:text-[#F7F4EE] motion-reduce:transition-none",
                        featured ? "text-3xl" : "text-2xl",
                      )}
                    >
                      {category.name}
                    </h3>
                    <span className="shrink-0 text-sm text-[#1F3A32]/70 dark:text-[#E4E9DD]/70">
                      {category.count}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-[#1F3A32]/75 dark:text-[#E4E9DD]/75">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
