"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Finish = "matte" | "gloss" | "textured";
export type Product = "card" | "invitation" | "photobook";

export type ProductConfig = {
  name: string;
  base: number;
  aspect: string;
  min: number;
  tiers: { qty: number; mult: number }[];
};

const PRODUCTS: Record<Product, ProductConfig> = {
  card: {
    name: "Visiting Card",
    base: 1.2,
    aspect: "aspect-[1.75/1]",
    min: 50,
    tiers: [
      { qty: 100, mult: 1 },
      { qty: 250, mult: 0.85 },
      { qty: 500, mult: 0.7 },
      { qty: 1000, mult: 0.55 },
    ],
  },
  invitation: {
    name: "Wedding Invitation",
    base: 8.5,
    aspect: "aspect-[5/7]",
    min: 25,
    tiers: [
      { qty: 50, mult: 1 },
      { qty: 100, mult: 0.9 },
      { qty: 200, mult: 0.8 },
    ],
  },
  photobook: {
    name: "Heirloom Photobook",
    base: 285,
    aspect: "aspect-[4/5]",
    min: 1,
    tiers: [
      { qty: 1, mult: 1 },
      { qty: 3, mult: 0.92 },
      { qty: 5, mult: 0.85 },
    ],
  },
};

const FINISH_MULT: Record<Finish, number> = {
  matte: 1,
  gloss: 1.15,
  textured: 1.35,
};

interface DesignCanvasProps {
  className?: string;
  onProductChange?: (product: Product) => void;
  onFinishChange?: (finish: Finish) => void;
  onQuantityChange?: (qty: number) => void;
  onImageChange?: (imageUrl: string | null) => void;
  defaultProduct?: Product;
  defaultFinish?: Finish;
  defaultQty?: number;
  showCheckoutButton?: boolean;
  checkoutUrl?: string;
}

const DesignCanvas = ({
  className,
  onProductChange,
  onFinishChange,
  onQuantityChange,
  onImageChange,
  defaultProduct = "invitation",
  defaultFinish = "matte",
  defaultQty = 50,
  showCheckoutButton = false,
  checkoutUrl = "/checkout",
}: DesignCanvasProps) => {
  const [product, setProduct] = useState<Product>(defaultProduct);
  const [finish, setFinish] = useState<Finish>(defaultFinish);
  const [qty, setQty] = useState(defaultQty);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const p = PRODUCTS[product];

  const unit = useMemo(() => {
    const tier = [...p.tiers].reverse().find((t) => qty >= t.qty) ?? p.tiers[0];
    return p.base * tier.mult * FINISH_MULT[finish];
  }, [p, qty, finish]);

  const total = unit * qty;

  const handleProductChange = (newProduct: Product) => {
    setProduct(newProduct);
    setQty(PRODUCTS[newProduct].min * 2);
    onProductChange?.(newProduct);
  };

  const handleFinishChange = (newFinish: Finish) => {
    setFinish(newFinish);
    onFinishChange?.(newFinish);
  };

  const handleQtyChange = (newQty: number) => {
    const clamped = Math.max(p.min, newQty);
    setQty(clamped);
    onQuantityChange?.(clamped);
  };

  const handleImageUpload = (f: File | undefined) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
    onImageChange?.(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Product type */}
      <div className="card-elegant p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Product
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(PRODUCTS) as Product[]).map((k) => (
            <button
              key={k}
              onClick={() => handleProductChange(k)}
              className={cn(
                "px-3 py-3 text-[11px] tracking-wider uppercase border transition-all",
                product === k
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              {PRODUCTS[k].name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div
        className="card-elegant p-6 border-dashed hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleImageUpload(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files?.[0] ?? undefined)}
        />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-border flex items-center justify-center rounded-lg">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-display text-lg">
              {image ? "Replace artwork" : "Upload artwork"}
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG, PDF &middot; up to 50MB
            </div>
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="card-elegant p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Quantity
          {qty < p.min && (
            <span className="text-destructive normal-case tracking-normal">
              &middot; min {p.min}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQtyChange(qty - (qty > 100 ? 25 : 5))}
            className="w-10 h-10 border border-border hover:border-primary/50 flex items-center justify-center rounded-lg transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="number"
            value={qty}
            min={p.min}
            onChange={(e) => handleQtyChange(parseInt(e.target.value) || p.min)}
            className="font-display text-3xl text-center w-full bg-transparent focus:outline-none"
          />
          <button
            onClick={() => handleQtyChange(qty + (qty >= 100 ? 25 : 5))}
            className="w-10 h-10 border border-border hover:border-primary/50 flex items-center justify-center rounded-lg transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {p.tiers.map((t) => (
            <button
              key={t.qty}
              onClick={() => handleQtyChange(t.qty)}
              className={cn(
                "py-2 text-[10px] tracking-[0.2em] uppercase border rounded transition-colors",
                qty >= t.qty
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {t.qty}
              {t.mult < 1 && (
                <span className="ml-1">−{Math.round((1 - t.mult) * 100)}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <motion.div
        key={total}
        initial={{ opacity: 0.5, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elegant p-6 bg-primary text-primary-foreground"
      >
        <div className="flex justify-between items-baseline mb-2 opacity-80">
          <span className="text-[11px] tracking-[0.25em] uppercase">
            Per unit
          </span>
          <span className="font-display text-xl">${unit.toFixed(2)}</span>
        </div>
        <div className="w-full h-px bg-current opacity-20 my-4" />
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] tracking-[0.25em] uppercase">Total</span>
          <span className="font-display text-4xl">${total.toFixed(2)}</span>
        </div>

        {showCheckoutButton && (
          <Button variant="secondary" size="lg" className="w-full mt-6" asChild>
            <a href={checkoutUrl}>
              Proceed to Checkout <Check className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        )}

        <div className="mt-4 text-[10px] tracking-[0.2em] uppercase opacity-50 text-center">
          Ships within 7 days &middot; Premium packaging included
        </div>
      </motion.div>

      {/* Finish Toggles */}
      <div className="card-elegant p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Finish
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["matte", "gloss", "textured"] as Finish[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFinishChange(f)}
              className={cn(
                "p-4 border text-left transition-all rounded-lg",
                finish === f
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className="text-[10px] tracking-[0.3em] uppercase mb-1 opacity-60">
                Finish
              </div>
              <div className="font-display text-lg capitalize">{f}</div>
              <div className="text-[10px] mt-2 opacity-60">
                {f === "matte"
                  ? "Soft & understated"
                  : f === "gloss"
                    ? "Crisp reflective"
                    : "Hand-pressed grain"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <div className="card-elegant p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Preview &middot; {finish}
        </div>
        <div
          className={cn(
            "relative bg-background shadow-xl overflow-hidden rounded-xl mx-auto",
            p.aspect,
            finish === "gloss" ? "ring-1 ring-white/20" : "",
            finish === "textured" ? "ring-1 ring-primary/30" : "",
          )}
          style={
            finish === "gloss"
              ? {
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.2)",
                }
              : finish === "textured"
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px)",
                  }
                : undefined
          }
        >
          {image ? (
            <img
              src={image}
              alt="Your upload"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 p-6 text-center">
              <ImageIcon className="h-8 w-8 mb-3" />
              <div className="font-display italic text-lg">
                Awaiting your artwork
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;
