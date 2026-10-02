"use client";

import {
  Upload,
  Image as ImageIcon,
  X,
  Package,
  Palette,
  Hash,
  GripVertical,
  Sparkles,
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { pricingConfig } from "./data";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type Product = "invitation" | "card" | "photobook";
type Finish = "matte" | "gloss" | "textured";

interface MediaStepProps {
  previews: string[];
  uploadedCount: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onProductChange: (product: Product) => void;
  onFinishChange: (finish: Finish) => void;
  onQuantityChange: (qty: number) => void;
  onImageChange: (url: string | null) => void;
}

const PRODUCT_OPTIONS: {
  value: Product;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: "invitation",
    label: "Invitation",
    desc: "Standard 5x7 card",
    icon: "💌",
  },
  {
    value: "card",
    label: "Visiting Card",
    desc: "Business card size",
    icon: "📇",
  },
  {
    value: "photobook",
    label: "Photobook",
    desc: "Premium bound book",
    icon: "📖",
  },
];

const FINISH_OPTIONS: {
  value: Finish;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "matte",
    label: "Matte",
    desc: "Soft & understated",
    color: "bg-zinc-200",
  },
  {
    value: "gloss",
    label: "Gloss",
    desc: "Crisp & reflective",
    color: "bg-gradient-to-br from-blue-100 to-purple-100",
  },
  {
    value: "textured",
    label: "Textured",
    desc: "Hand-pressed grain",
    color: "bg-gradient-to-br from-amber-100 to-orange-100",
  },
];

const QTY_TIERS = [25, 50, 100, 200];

export default function MediaStep({
  previews,
  uploadedCount,
  fileInputRef,
  onFileUpload,
  onRemoveImage,
  onProductChange,
  onFinishChange,
  onQuantityChange,
}: MediaStepProps) {
  const maxReached = previews.length >= 5;
  const [orderedPreviews, setOrderedPreviews] = useState(previews);

  // Calculate estimated price
  function calculateEstimatedPrice() {
    // This will be replaced with actual pricing when we have the product/finish/qty selected
    // For now show a placeholder estimate
    return "₹500 - ₹2,500";
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Upload Images */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Upload Images
              </h2>
              <p className="text-sm text-muted-foreground">
                Add reference photos for your design
              </p>
            </div>
            {uploadedCount > 0 && (
              <div className="ml-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {uploadedCount}/5
                </motion.div>
              </div>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
              >
                {previews.map((preview, index) => (
                  <motion.div
                    key={`${preview}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted ring-1 ring-border/50 relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Drag to reorder
                        </motion.span>
                      </div>
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 w-5 h-5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.label
            whileHover={maxReached ? {} : { scale: 1.005 }}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer block transition-all duration-300 group",
              maxReached
                ? "border-muted/30 bg-muted/10 opacity-60 cursor-not-allowed"
                : "border-border/60 hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-lg hover:shadow-primary/5",
            )}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 ring-1 ring-primary/10 group-hover:scale-110 transition-all duration-300">
              <Upload className="h-7 w-7 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium">
              {maxReached
                ? "Maximum images reached"
                : "Drop images or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Supports: PNG, JPG, JPEG (Max 5 images)
            </p>
            {previews.length > 0 && (
              <p className="text-[10px] text-primary/40 mt-2">
                Tip: Drag images to reorder them
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onFileUpload}
              className="hidden"
              disabled={maxReached}
            />
          </motion.label>
        </div>
      </motion.div>

      {/* Product Selection */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Product Type
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose the type of print product
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PRODUCT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onProductChange(opt.value)}
                className="p-4 rounded-xl border-2 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
              >
                <span className="text-xl mb-1 block">{opt.icon}</span>
                <div className="font-display text-sm font-semibold">
                  {opt.label}
                </div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Finish Selection */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Finish</h2>
              <p className="text-sm text-muted-foreground">
                Select the paper finish
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {FINISH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFinishChange(opt.value)}
                className="p-4 rounded-xl border-2 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
              >
                <div className={cn("w-full h-8 rounded-lg mb-2", opt.color)} />
                <div className="font-display text-sm font-semibold capitalize">
                  {opt.label}
                </div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quantity */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-5 relative overflow-hidden">
          {/* Premium badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/10 to-transparent px-4 py-1.5 rounded-bl-xl">
            <span className="text-[9px] tracking-wider text-primary/60 font-medium">
              BULK DISCOUNTS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Quantity</h2>
              <p className="text-sm text-muted-foreground">
                How many copies do you need?
              </p>
            </div>
          </div>

          {/* Quantity buttons with saver indicator */}
          <div className="grid grid-cols-4 gap-3">
            {QTY_TIERS.map((q, i) => {
              const savings =
                i > 0
                  ? `${Math.round((1 - QTY_TIERS[i] / QTY_TIERS[0]) * 100)}%`
                  : null;

              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => onQuantityChange(q)}
                  className="relative py-3 rounded-xl border-2 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="font-display text-lg font-semibold">{q}</div>
                  {savings && (
                    <div className="text-[9px] text-green-500 font-medium mt-0.5 bg-green-500/10 px-1.5 py-0.5 rounded-full inline-block">
                      Save {savings}
                    </div>
                  )}
                  {i === 2 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Price estimate */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10"
          >
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Estimated total
            </span>
            <span className="font-display text-lg font-semibold text-primary">
              {calculateEstimatedPrice()}
            </span>
          </motion.div>

          <div className="text-xs text-muted-foreground/50 text-center">
            Custom quantities available on request
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
