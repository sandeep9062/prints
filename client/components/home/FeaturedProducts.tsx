"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Royal Elegance Wedding Card",
    category: "Bespoke Wedding Cards",
    price: 2500,
    originalPrice: 3000,
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&q=80",
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Floral Dream Invitation",
    category: "Event Invitations",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=500&q=80",
    badge: "New Arrival",
  },
  {
    id: "3",
    name: "Premium Business Card Set",
    category: "Corporate Identity",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80",
  },
  {
    id: "4",
    name: "Vintage Gold Wedding Suite",
    category: "Premium Collections",
    price: 4500,
    originalPrice: 5500,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    badge: "Signature",
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-[#FCFBF9] dark:bg-[#0f111a]">
      <div className="container mx-auto px-6">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.4em] font-bold text-stone-400 dark:text-stone-500 uppercase">
              Selected Works
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-100 mt-3 italic">
              The Featured Collection
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 pb-1"
          >
            Browse All Suites
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
