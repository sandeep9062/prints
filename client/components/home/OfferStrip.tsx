"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

export default function OfferStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const offers = [
    "Complimentary delivery on all orders over ₹999",
    "Seasonal Collection: Enjoy 20% savings on bespoke stationery",
    "Corporate Exclusive: Buy 2 Business Card sets, receive the 3rd complimentary",
    "Limited Time: Festive printing suites now available",
  ];

  return (
    <div className="w-full bg-stone-900 text-stone-100 py-2.5 relative border-b border-white/10 shadow-sm">
      <div className="container mx-auto flex items-center px-4">
        {/* Scrolling Offers */}
        <div className="flex-1 overflow-hidden">
          <Marquee
            gradient={true}
            gradientColor="rgb(28, 25, 23)"
            gradientWidth={50}
            speed={35}
          >
            {offers.map((offer, index) => (
              <div key={index} className="flex items-center mx-12">
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
                  {offer}
                </span>
                <Link href="/offers" className="ml-3 group flex items-center">
                  <span className="text-[10px] underline underline-offset-4 decoration-stone-500 hover:decoration-white transition-colors uppercase tracking-widest">
                    Details
                  </span>
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Minimalist Close button */}
        <button
          onClick={() => setVisible(false)}
          className="ml-6 p-1 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
