"use client";

import {
  Filter,
  Package,
  MapPin,
  Phone,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useGetMyOrdersQuery } from "@/services/userApi";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-gold/15", text: "text-gold-text" },
  processing: { bg: "bg-brand-soft", text: "text-brand" },
  shipped: { bg: "bg-brand-soft", text: "text-brand" },
  delivered: { bg: "bg-success/10", text: "text-success" },
  cancelled: { bg: "bg-destructive/10", text: "text-destructive" },
};

const statusTimeline = ["pending", "processing", "shipped", "delivered"];

export default function OrderHistoryPage() {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-foreground">
            Order History
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            View and track your orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-muted-foreground text-xs font-bold hover:bg-muted transition-all duration-200">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm py-16 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/70" />
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      )}

      {orders.map((order: any) => {
        const currentStatusIndex = statusTimeline.indexOf(order.orderStatus);
        const colors = statusColors[order.orderStatus] || {
          bg: "bg-muted",
          text: "text-foreground",
        };
        const address = order.address;

        return (
          <div
            key={order._id}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 mb-6"
          >
            {/* Order Status Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-muted border-b border-border">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground ">
                  Order #{order._id.slice(-10).toUpperCase()}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-lg ${colors.bg} ${colors.text}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="space-y-4">
                  <h4 className="font-sans text-xs font-semibold text-muted-foreground ">
                    Shipping Details
                  </h4>
                  <div>
                    <p className="font-semibold text-foreground">
                      {address?.fullName || "N/A"}
                    </p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {address
                          ? `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
                          : "No address"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {address?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h4 className="font-sans text-xs font-semibold text-muted-foreground ">
                    Order Summary
                  </h4>
                  <div className="bg-muted rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Items ({order.items?.length || 0})
                      </span>
                      <span className="font-medium text-foreground tabular-nums">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-success font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">
                        Total
                      </span>
                      <span className="font-semibold text-foreground tabular-nums">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {order.paymentMethod && (
                      <span className="capitalize">{order.paymentMethod}</span>
                    )}
                    {order.paymentStatus && (
                      <span className="ml-2 uppercase text-[10px] font-bold">
                        • {order.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl text-muted-foreground text-xs font-bold hover:bg-muted transition-all duration-200">
                  Reorder
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-footer text-footer-foreground text-xs font-bold rounded-xl hover:bg-brand-hover hover:text-primary-foreground transition-all duration-200 shadow-sm">
                  Track Order
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="px-6 py-4 bg-muted/50 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                {statusTimeline.map((status, idx) => {
                  const isReached = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={status} className="flex items-center gap-2">
                      {idx > 0 && (
                        <span className="text-muted-foreground/70 text-xs">—</span>
                      )}
                      <div
                        className={`flex items-center gap-1.5 text-xs ${
                          isCurrent
                            ? "text-success font-medium"
                            : isReached
                              ? "text-muted-foreground"
                              : "text-muted-foreground/70"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full inline-block ${
                            isReached ? "bg-success" : "bg-muted"
                          }`}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </div>
                  );
                })}
                {order.orderStatus === "cancelled" && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive font-medium ml-2">
                    <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                    Cancelled
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
