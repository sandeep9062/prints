"use client";

import { BookText, Plus, Trash2, Edit2 } from "lucide-react";

export default function AddressBookPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Address Book</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-stone-900 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm p-8 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2">
              Default
            </span>
            <h3 className="font-medium text-stone-900">Home Address</h3>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed">
          sco7, Dashmesh Square, Patiala Road, Lohgarh, Zirakpur, Mohali,
          Punjab, India, 140603
        </p>
        <p className="text-stone-500 text-sm mt-2">+91 9729907448</p>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-stone-900">Office Address</h3>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed">
          IT Park, Phase 8, Mohali, Punjab, India, 160055
        </p>
        <p className="text-stone-500 text-sm mt-2">+91 9876543210</p>
      </div>
    </div>
  );
}
