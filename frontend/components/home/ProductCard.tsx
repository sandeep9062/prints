"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  description?: string;
};

export const ProductCard = ({
  product,
  index,
  showDescription = false,
}: {
  product: Product;
  index: number;
  /** Renders the blurb + CTA. Used by the "large" view on /products. */
  showDescription?: boolean;
}) => {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Cap the stagger so long catalogues don't crawl in.
      transition={{ delay: Math.min(index, 8) * 0.06, duration: 0.5 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Image Composition */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={product.image}
          alt={product.name}
          loading={index < 4 ? "eager" : "lazy"}
          className="h-full w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {/* Inner vignette for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-900 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-100">
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute right-4 top-4 bg-red-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
            {discount}% Off
          </span>
        )}

        {/* Quick View overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none">
          <Link
            href={`/products/${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-none bg-stone-900/90 py-6 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            Quick View
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          {product.category}
        </p>

        <h3 className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-red-800 dark:text-stone-100 dark:group-hover:text-red-600">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800"
          >
            {product.name}
          </Link>
        </h3>

        {showDescription && product.description && (
          <p className="line-clamp-2 max-w-sm text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-medium tabular-nums text-stone-900 dark:text-stone-100">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs tabular-nums text-stone-300 line-through dark:text-stone-600">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
