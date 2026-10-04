"use client";

import { Ticket } from "lucide-react";

/*
 * Coupons are not backed by an API yet — there is no coupon or discount model
 * on the backend. This page previously rendered three invented codes
 * (WELCOME10, FREESHIP, SAVE20) with fabricated discounts and expiry dates,
 * presented as if they were the signed-in customer's saved coupons. Codes that
 * look real but don't work are worse than an empty list, so until the feature
 * exists this shows an honest empty state.
 */

interface Coupon {
  code: string;
  discount: string;
  expires: string;
  valid: boolean;
  description: string;
}

// No data source yet — deliberately empty. Populate from a real API when the
// coupon system is built.
const coupons: Coupon[] = [];

export default function SavedCouponPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-foreground">
            Saved Coupons
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Your available discounts and offers
          </p>
        </div>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-sm px-6 py-16 text-center">
          <Ticket className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-4 text-sm font-medium text-foreground">
            No saved coupons
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Discount codes you save will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className={`bg-card rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                coupon.valid ? "border-border" : "border-border opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Coupon Visual Side */}
                <div
                  className={`relative flex items-center justify-center w-full sm:w-28 min-h-[100px] ${
                    coupon.valid
                      ? "bg-gradient-to-br from-brand to-brand-hover"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-center">
                    <Ticket
                      className={`w-8 h-8 mx-auto mb-1 ${
                        coupon.valid
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p
                      className={`text-[9px] font-medium ${
                        coupon.valid
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
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
                      <h3 className="font-sans font-mono font-semibold text-lg text-foreground tracking-tight">
                        {coupon.code}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          coupon.valid
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {coupon.valid ? "Active" : "Expired"}
                      </span>
                    </div>
                    <p className="text-foreground font-semibold text-sm">
                      {coupon.discount}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Expires: {coupon.expires}
                    </p>
                    {coupon.valid && (
                      <button className="px-5 py-2 bg-footer text-footer-foreground text-[10px] font-bold rounded-xl hover:bg-brand-hover hover:text-primary-foreground transition-all duration-200 shadow-sm active:scale-[0.98]">
                        Copy Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
