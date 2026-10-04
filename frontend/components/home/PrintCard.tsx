"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import Heart from "@/components/Heart";
import CompareToggle from "@/components/CompareToggle";
import { formatINR } from "@/lib/utils";

export interface PrintCardProps {
  card: {
    _id?: string;
    id?: string;
    name?: string;
    title?: string;
    category?: string;
    price?: number;
    originalPrice?: number;
    description?: string;
    image?: string;
    images?: string[];
    badge?: string;
    inStock?: boolean;
  };
  /** Renders the blurb + CTA. Used by the "large" view on /products. */
  showDescription?: boolean;
}

/**
 * Catalogue card for a printable product.
 *
 * Pairs with <CompareDrawer> — the compare toggle feeds the CompareProvider
 * tray, which caps at MAX_COMPARE_ITEMS so the comparison stays readable.
 */
function PrintCard({ card, showDescription = false }: PrintCardProps) {
  const id = card._id ?? card.id ?? card.name ?? "";
  const title = card.name ?? card.title ?? "Print product";
  const image = card.image ?? card.images?.[0] ?? "/inkofmemories.png";
  const price = Number(card.price) || 0;

  const discount =
    card.originalPrice && card.originalPrice > price
      ? Math.round(((card.originalPrice - price) / card.originalPrice) * 100)
      : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/products/${id}`} aria-label={title}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {card.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
            {card.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">
            {discount}% off
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <Heart card={{ _id: id, ...card }} />
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {card.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
            {card.category}
          </span>
        )}

        <h3 className="font-sans text-lg font-semibold leading-snug text-foreground">
          <Link href={`/products/${id}`}>{title}</Link>
        </h3>

        {showDescription && card.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {card.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <span className="text-lg font-bold text-foreground">
              {formatINR(price)}
            </span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-muted-foreground/80 line-through">
                {formatINR(Number(card.originalPrice))}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hi, I'd like a quote for "${title}".`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ask for a quote on WhatsApp"
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <FaWhatsapp />
            </a>

            <CompareToggle
              item={{
                _id: id,
                title,
                image,
                price,
                originalPrice: card.originalPrice
                  ? Number(card.originalPrice)
                  : undefined,
                category: card.category,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(PrintCard);
