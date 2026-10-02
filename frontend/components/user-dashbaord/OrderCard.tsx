"use client";

import React from "react";

interface OrderProps {
  orderId: string;
  status: string;
  customerName: string;
  address: string;
  phone: string;
}

export const OrderCard = ({
  orderId,
  status,
  customerName,
  address,
  phone,
}: OrderProps) => {
  return (
    <div className="bg-white border border-stone-200 group hover:border-stone-400 transition-colors">
      <div className="p-6 md:p-8">
        {/* Header: ID & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
              Order Reference
            </p>
            <p className="text-sm font-semibold text-stone-900">{orderId}</p>
          </div>
          <div className="mt-3 md:mt-0">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-stone-100 text-stone-600 border border-stone-200">
              {status}
            </span>
          </div>
        </div>

        {/* Content: Details & Actions */}
        <div className="grid md:grid-cols-2 gap-8 items-end">
          <div className="space-y-1">
            <p className="text-sm font-bold text-stone-900 uppercase tracking-tight">
              {customerName}
            </p>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
              {address}
            </p>
            <p className="text-xs text-stone-400 pt-2 font-medium">{phone}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <button className="px-8 py-3 border border-stone-200 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-stone-50 transition-all">
              Reorder
            </button>
            <button className="px-8 py-3 bg-stone-900 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-all">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
