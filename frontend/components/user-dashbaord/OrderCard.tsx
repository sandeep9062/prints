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
    <div className="bg-card border border-border group hover:border-border transition-colors">
      <div className="p-6 md:p-8">
        {/* Header: ID & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground ">
              Order Reference
            </p>
            <p className="text-sm font-semibold text-foreground">{orderId}</p>
          </div>
          <div className="mt-3 md:mt-0">
            <span className="text-[10px] font-bold px-3 py-1 bg-muted-foreground border border-border">
              {status}
            </span>
          </div>
        </div>

        {/* Content: Details & Actions */}
        <div className="grid md:grid-cols-2 gap-8 items-end">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground uppercase tracking-tight">
              {customerName}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              {address}
            </p>
            <p className="text-xs text-muted-foreground pt-2 font-medium">{phone}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <button className="px-8 py-3 border border-border text-[10px] font-bold hover:bg-muted transition-all">
              Reorder
            </button>
            <button className="px-8 py-3 bg-footer text-footer-foreground text-[10px] font-bold hover:bg-brand-hover hover:text-primary-foreground transition-all">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
