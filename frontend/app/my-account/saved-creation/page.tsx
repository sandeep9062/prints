"use client";

import {
  Heart,
  Sparkles,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  useGetMyCustomizationsQuery,
  useDeleteCustomizationMutation,
} from "@/services/customizationApi";

export default function SavedCreationPage() {
  const { data, isLoading } = useGetMyCustomizationsQuery();
  const [deleteCustomization] = useDeleteCustomizationMutation();

  const customizations = Array.isArray(data) ? data : data?.data || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomization(id).unwrap();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Saved Creations
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Your custom design collection
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      )}

      {!isLoading && customizations.length === 0 && (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="py-20 px-8 text-center">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-stone-400" strokeWidth={1.2} />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles
                  className="w-6 h-6 text-stone-400"
                  strokeWidth={1.2}
                />
              </div>
            </div>

            <h3 className="text-2xl font-serif text-stone-900 mb-3">
              No saved creations yet
            </h3>
            <p className="text-stone-500 mb-10 max-w-md mx-auto leading-relaxed">
              You haven't saved any custom designs yet. Start creating and save
              your favorite designs here to easily find them later.
            </p>

            <button className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm active:scale-[0.98]">
              <Sparkles className="w-4 h-4" />
              Start Creating
            </button>
          </div>
        </div>
      )}

      {!isLoading && customizations.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {customizations.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                {item.uploadedImages?.[0] ? (
                  <img
                    src={item.uploadedImages[0]}
                    alt="Creation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sparkles
                    className="w-10 h-10 text-stone-400"
                    strokeWidth={1}
                  />
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-stone-900">
                  {item.groomName} & {item.brideName}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.eventDate
                    ? new Date(item.eventDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Date not set"}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-50">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
                    Template: {item.selectedTemplate?.name || "Custom"}
                  </span>
                  <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
