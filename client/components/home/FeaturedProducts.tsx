"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "@/services/productsApi";
import { ProductCard } from "./ProductCard";

type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  badge?: string;
  featured?: boolean;
};

export const FeaturedProducts = () => {
  const { data, isLoading, isError } = useGetProductsQuery();

  // Transform API products to ProductCard format and filter featured ones
  const featuredProducts: ProductCardProps[] = (data?.products || [])
    .filter((p: ApiProduct) => p.featured)
    .slice(0, 4)
    .map((p: ApiProduct) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice:
        p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
      image: p.images?.[0] || "/placeholder.svg",
      badge: p.badge,
    }));

  if (isLoading) {
    return (
      <section className="py-24 bg-[#FCFBF9] dark:bg-[#0f111a]">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-800 overflow-hidden mb-6 animate-pulse">
                  <div className="w-full h-full bg-stone-200 dark:bg-stone-700" />
                </div>
                <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4 mx-auto md:mx-0" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2 mx-auto md:mx-0 mt-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !featuredProducts.length) {
    return null;
  }

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
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
