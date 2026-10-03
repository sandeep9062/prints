"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import Heart from "@/components/Heart";
import CompareToggle from "@/components/CompareToggle";

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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
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
          <span className="absolute left-3 top-3 rounded-full bg-[#4161df] px-2.5 py-1 text-[11px] font-semibold text-white">
            {card.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
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
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#4161df]">
            {card.category}
          </span>
        )}

        <h3 className="font-[Poppins] text-lg font-semibold leading-snug text-slate-900">
          <Link href={`/products/${id}`}>{title}</Link>
        </h3>

        {showDescription && card.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {card.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-slate-400 line-through">
                ₹{Number(card.originalPrice).toLocaleString("en-IN")}
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
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-green-500 hover:text-green-600"
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
