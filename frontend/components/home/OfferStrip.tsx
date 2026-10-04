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
    <div className="w-full bg-footer py-2.5 relative border-b border-gold/20 shadow-sm text-footer-foreground">
      <div className="container mx-auto flex items-center px-4">
        {/* Scrolling Offers */}
        <div className="flex-1 overflow-hidden">
          <Marquee
            gradient={true}
            gradientColor="hsl(var(--footer))"
            gradientWidth={50}
            speed={35}
          >
            {offers.map((offer, index) => (
              <div key={index} className="flex items-center mx-12">
                <span className="text-[11px] font-medium">
                  {offer}
                </span>
                <Link href="/offers" className="group -my-2 ml-3 flex items-center py-2">
                  <span className="text-[10px] underline underline-offset-4 decoration-footer-muted hover:decoration-gold transition-colors ">
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
