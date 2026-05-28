"use client";

import { Ticket } from "lucide-react";

export default function SavedCouponPage() {
  const coupons = [
    {
      code: "WELCOME10",
      discount: "10% OFF",
      expires: "31 Dec 2026",
      valid: true,
    },
    {
      code: "FREESHIP",
      discount: "Free Shipping",
      expires: "15 Jan 2026",
      valid: true,
    },
    {
      code: "SAVE20",
      discount: "20% OFF",
      expires: "05 Nov 2025",
      valid: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Saved Coupons</h2>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`bg-white border ${coupon.valid ? "border-stone-100" : "border-stone-200 opacity-60"} shadow-sm p-6`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                  <Ticket
                    className={`w-6 h-6 ${coupon.valid ? "text-stone-600" : "text-stone-400"}`}
                  />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg text-stone-900">
                    {coupon.code}
                  </h3>
                  <p className="text-stone-500 text-sm">{coupon.discount}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${coupon.valid ? "text-green-600" : "text-stone-400"}`}
                >
                  {coupon.valid ? "Valid" : "Expired"}
                </p>
                <p className="text-stone-500 text-sm mt-1">
                  Expires: {coupon.expires}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
