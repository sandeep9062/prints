"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Heart from "@/components/Heart";
import CompareToggle from "@/components/CompareToggle";
import AddToCartButton from "@/components/AddToCartButton";
import { formatINR } from "@/lib/utils";

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
  featured?: boolean;
  /**
   * Minimum order quantity. The storefront prices against this unit, so the
   * quick-add button adds it rather than 1. Optional because callers that build
   * cards from lighter payloads (wishlist) may not have it.
   */
  minQuantity?: number;
  /** Optional — when present, an out-of-stock product disables quick-add. */
  stock?: number;
};

export const ProductCard = ({
  product,
  index = 0,
  showDescription = false,
}: {
  product: Product;
  index?: number;
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
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading={index < 4 ? "eager" : "lazy"}
          className="h-full w-full object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {/* Inner vignette for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5 dark:ring-foreground/10"
        />

        {/* Top-left flag stack: Featured tag sits above the optional badge,
            with the discount chip last so the editorial tags keep priority */}
        {(product.featured || product.badge || discount > 0) && (
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
            {product.featured && (
              <span className="inline-flex items-center gap-1 bg-footer px-3 py-1.5 text-[9px] font-bold text-background">
                <Sparkles aria-hidden="true" className="h-2.5 w-2.5" />
                Featured
              </span>
            )}

            {product.badge && (
              <span className="bg-background/90 px-3 py-1.5 text-[9px] font-bold text-foreground backdrop-blur-sm">
                {product.badge}
              </span>
            )}

            {discount > 0 && (
              <span className="bg-primary px-3 py-1.5 text-[9px] font-bold text-primary-foreground">
                {discount}% Off
              </span>
            )}
          </div>
        )}

        {/* Card actions — wishlist, compare and quick-add share the top-right rail
            so they stack instead of overlapping the flags above. */}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-2">
          <Heart card={{ _id: product.id, id: product.id }} />
          <CompareToggle
            item={{
              _id: product.id,
              title: product.name,
              image: product.image,
              price: product.price,
              originalPrice: product.originalPrice,
              category: product.category,
              slug: product.slug,
            }}
          />
          <AddToCartButton
            item={{
              id: product.id,
              name: product.name,
              // Cards receive the effective price already — both call sites
              // resolve `discountPrice` before building the object — so the
              // cart line is stored at what the card actually displays.
              price: product.price,
              image: product.image,
              minQuantity: product.minQuantity,
              stock: product.stock,
            }}
          />
        </div>

        {/* Quick View overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none">
          <Link
            href={`/products/${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-none bg-black/90 py-6 text-[10px] font-medium text-background backdrop-blur-sm transition-colors hover:bg-brand hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
          >
            Quick View
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground">
          {product.category}
        </p>

        <h3 className="text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {product.name}
          </Link>
        </h3>

        {showDescription && product.description && (
          <p className="line-clamp-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-medium tabular-nums text-foreground">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs tabular-nums text-muted-foreground/70 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
