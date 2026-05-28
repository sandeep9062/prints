"use client";

import { Heart } from "lucide-react";

export default function SavedCreationPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Saved Creations</h2>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-16 text-center">
          <div className="mb-6">
            <Heart
              className="w-16 h-16 mx-auto text-stone-300"
              strokeWidth={1}
            />
          </div>
          <h3 className="text-xl font-serif text-stone-900 mb-3">
            No saved creations yet
          </h3>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            You haven't saved any custom designs. Start creating and save your
            favorite designs here.
          </p>
          <button className="px-8 py-3 border border-stone-900 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}
