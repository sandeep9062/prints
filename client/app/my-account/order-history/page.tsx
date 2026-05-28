"use client";

import { Filter } from "lucide-react";

export default function OrderHistoryPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Order History</h2>
        <button className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* ORDER CARD */}
      <div className="bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
                Order ID
              </p>
              <p className="text-sm font-medium text-stone-900 uppercase">
                ZO-B43A47AB89
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-3 py-1">
                Delivered
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-sm font-bold text-stone-900">Sandeep Saini</p>
              <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                sco7, Dashmesh Square, Patiala Road, Lohgarh, Zirakpur, Mohali,
                Punjab, India, 140603
              </p>
              <p className="text-sm text-stone-500 pt-2">+91 9729907448</p>
            </div>

            <div className="flex flex-col sm:flex-row items-end justify-end gap-3 self-end">
              <button className="w-full sm:w-auto px-10 py-3 border border-stone-200 text-stone-600 text-xs font-bold tracking-widest uppercase hover:bg-stone-50 transition-colors">
                Reorder
              </button>
              <button className="w-full sm:w-auto px-10 py-3 border border-stone-900 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
