"use client";

import { Ticket, Tag, CheckCircle2, XCircle } from "lucide-react";

export default function SavedCouponPage() {
  const coupons = [
    {
      code: "WELCOME10",
      discount: "10% OFF",
      expires: "31 Dec 2026",
      valid: true,
      description: "Welcome discount for new customers",
    },
    {
      code: "FREESHIP",
      discount: "Free Shipping",
      expires: "15 Jan 2026",
      valid: true,
      description: "Free shipping on all orders",
    },
    {
      code: "SAVE20",
      discount: "20% OFF",
      expires: "05 Nov 2025",
      valid: false,
      description: "Save big on bulk orders",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Saved Coupons
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Your available discounts and offers
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
              coupon.valid ? "border-stone-100" : "border-stone-200 opacity-60"
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Coupon Visual Side */}
              <div
                className={`relative flex items-center justify-center w-full sm:w-28 min-h-[100px] ${
                  coupon.valid
                    ? "bg-gradient-to-br from-stone-800 to-stone-900"
                    : "bg-stone-300"
                }`}
              >
                <div className="text-center">
                  <Ticket
                    className={`w-8 h-8 mx-auto mb-1 ${
                      coupon.valid ? "text-white" : "text-stone-500"
                    }`}
                  />
                  <p
                    className={`text-[9px] font-bold tracking-widest uppercase ${
                      coupon.valid ? "text-white/70" : "text-stone-500"
                    }`}
                  >
                    Coupon
                  </p>
                </div>
                {/* Dashed line pseudo-element on right */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-dashed hidden sm:block" />
              </div>

              {/* Coupon Content */}
              <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-mono font-bold text-lg text-stone-900 tracking-tight">
                      {coupon.code}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        coupon.valid
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {coupon.valid ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Expired
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-stone-700 font-semibold text-sm">
                    {coupon.discount}
                  </p>
                  <p className="text-stone-400 text-xs mt-1">
                    {coupon.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-[10px] text-stone-400 font-medium">
                    Expires: {coupon.expires}
                  </p>
                  {coupon.valid && (
                    <button className="px-5 py-2 bg-stone-900 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm active:scale-[0.98]">
                      Copy Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
