"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
};
export const ProductCard = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  return (
    <motion.div
      key={product.id}
      className="group"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Image Composition */}
      <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-800 overflow-hidden mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute top-4 left-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-stone-900 dark:text-stone-100 text-[9px] font-bold tracking-[0.2em] px-3 py-1.5 uppercase shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link href={`/products/${product.id}`}>
            <Button className="w-full bg-stone-900/90 backdrop-blur-sm hover:bg-stone-900 text-white rounded-none py-6 text-[10px] tracking-widest uppercase">
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      {/* Refined Content */}
      <div className="text-center md:text-left space-y-2">
        <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold tracking-[0.2em] uppercase">
          {product.category}
        </p>

        <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-300 dark:text-stone-600 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
