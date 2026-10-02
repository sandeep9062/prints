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
  pending: { bg: "bg-amber-50", text: "text-amber-700" },
  processing: { bg: "bg-blue-50", text: "text-blue-700" },
  shipped: { bg: "bg-purple-50", text: "text-purple-700" },
  delivered: { bg: "bg-green-50", text: "text-green-700" },
  cancelled: { bg: "bg-red-50", text: "text-red-700" },
};

const statusTimeline = ["pending", "processing", "shipped", "delivered"];

export default function OrderHistoryPage() {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Order History
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            View and track your orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-xs font-bold tracking-widest uppercase hover:bg-stone-50 transition-all duration-200">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-stone-300" />
          <p className="text-stone-500">No orders yet.</p>
        </div>
      )}

      {orders.map((order: any) => {
        const currentStatusIndex = statusTimeline.indexOf(order.orderStatus);
        const colors = statusColors[order.orderStatus] || {
          bg: "bg-stone-50",
          text: "text-stone-700",
        };
        const address = order.address;

        return (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 mb-6"
          >
            {/* Order Status Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-stone-50 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase">
                  Order #{order._id.slice(-10).toUpperCase()}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg ${colors.bg} ${colors.text}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase">
                    Shipping Details
                  </h4>
                  <div>
                    <p className="font-semibold text-stone-900">
                      {address?.fullName || "N/A"}
                    </p>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-stone-500 leading-relaxed">
                        {address
                          ? `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
                          : "No address"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <p className="text-sm text-stone-500">
                        {address?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase">
                    Order Summary
                  </h4>
                  <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">
                        Items ({order.items?.length || 0})
                      </span>
                      <span className="font-medium text-stone-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-stone-200">
                      <span className="font-semibold text-stone-900">
                        Total
                      </span>
                      <span className="font-semibold text-stone-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-400">
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 pt-6 border-t border-stone-100">
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 rounded-xl text-stone-600 text-xs font-bold tracking-widest uppercase hover:bg-stone-50 transition-all duration-200">
                  Reorder
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm">
                  Track Order
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-100">
              <div className="flex items-center gap-2 flex-wrap">
                {statusTimeline.map((status, idx) => {
                  const isReached = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={status} className="flex items-center gap-2">
                      {idx > 0 && (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                      <div
                        className={`flex items-center gap-1.5 text-xs ${
                          isCurrent
                            ? "text-green-700 font-medium"
                            : isReached
                              ? "text-stone-500"
                              : "text-stone-300"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full inline-block ${
                            isReached ? "bg-green-500" : "bg-stone-200"
                          }`}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </div>
                  );
                })}
                {order.orderStatus === "cancelled" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium ml-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
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
