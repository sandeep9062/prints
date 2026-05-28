"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema, getProductSchema } from "@/lib/seo";
import type { Product } from "@/services/productsApi";

interface ProductDetailClientProps {
  product: Product;
  slug: string;
}

export default function ProductDetailClient({
  product,
  slug,
}: ProductDetailClientProps) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: `/products/${slug}` },
  ]);

  const productSchema = getProductSchema({
    name: product.name,
    description: product.description,
    slug: product.slug,
    image: product.images?.[0] || "https://inkofmemories.com/inkofmemories.png",
    price: product.discountPrice || product.price,
    currency: "INR",
    category: product.category,
    brand: "Samlason Printing Press",
  });

  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(50);

  /* ------------ SET DEFAULTS ------------ */
  useEffect(() => {
    if (!product) return;
    setSelectedImage(product?.images?.[0] || null);
    setSelectedSize(product?.options?.sizes?.[0] || "");
    setSelectedPaper(product?.options?.paperTypes?.[0] || "");
    setSelectedColor(product?.options?.colors?.[0] || "");
    setQuantity(product?.minQuantity || 50);
  }, [product]);

  /* ------------ PRICE CALCULATION ------------ */
  const basePrice = product?.price || 0;

  const calculatedPrice = useMemo(() => {
    return basePrice * (quantity / (product?.minQuantity || 1));
  }, [basePrice, quantity, product?.minQuantity]);

  const calculatedOriginal = useMemo(() => {
    if (!product?.discountPrice) return null;
    return product.discountPrice * (quantity / (product?.minQuantity || 1));
  }, [product?.discountPrice, quantity, product?.minQuantity]);

  /* ------------ ADD TO CART ------------ */
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product._id,
      name: product.name,
      price: calculatedPrice,
      quantity,
      image: selectedImage || "",
      customization: {
        size: selectedSize,
        paperType: selectedPaper,
        colorTheme: selectedColor,
      },
    });

    toast.success("Added to cart!", {
      description: `${product.name} (${quantity} pcs) added.`,
    });
  };

  const jsonLdArray: Record<string, any>[] = [
    breadcrumbSchema as Record<string, any>,
  ];
  if (productSchema) jsonLdArray.push(productSchema as Record<string, any>);

  /* ==============================================
            UI (IMPROVED PREMIUM VERSION)
     ============================================== */
  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title={product.name}
        description={
          product.description?.substring(0, 160) ||
          `Buy ${product.name} online from Samlason Printing Press. Premium quality printing at the best price.`
        }
        path={`/products/${slug}`}
        image={
          product.images?.[0] || "https://inkofmemories.com/inkofmemories.png"
        }
        keywords={`${product.name}, ${product.category}, buy ${product.name} online, printing ${product.category}`}
        type="product"
        jsonLd={jsonLdArray}
      />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back Button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-14">
            {/* ----------------- IMAGE SECTION ----------------- */}
            <div className="flex flex-col gap-5">
              {/* Main Carousel */}
              <div className="rounded-2xl shadow-md border bg-muted/10 p-2">
                <Carousel opts={{ loop: true }} className="w-full">
                  <CarouselContent>
                    {product.images.map((img: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square rounded-xl overflow-hidden bg-white">
                          <Image
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            width={900}
                            height={900}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-3" />
                  <CarouselNext className="right-3" />
                </Carousel>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border shadow-sm hover:shadow transition",
                      selectedImage === img
                        ? "border-primary ring-2 ring-primary"
                        : "border-muted",
                    )}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ----------------- DETAILS SECTION ----------------- */}
            <div className="space-y-8">
              {/* Badge */}
              {product.badge && (
                <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                  {product.badge}
                </span>
              )}

              {/* Title */}
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {product.description}
              </p>

              {/* Pricing */}
              <div className="flex items-end gap-4">
                <span className="text-4xl font-semibold text-primary">
                  ₹{Math.round(calculatedPrice).toLocaleString()}
                </span>

                {calculatedOriginal && (
                  <span className="line-through text-gray-500 text-lg mt-1">
                    ₹{Math.round(calculatedOriginal).toLocaleString()}
                  </span>
                )}

                <span className="text-xs text-muted-foreground pb-2">
                  ({quantity} pcs)
                </span>
              </div>

              {/* ---------------- OPTIONS ---------------- */}
              <div className="space-y-6">
                {/* Sizes */}
                {!!product.options?.sizes?.length && (
                  <OptionSection
                    title="Size"
                    options={product.options.sizes}
                    selected={selectedSize}
                    setSelected={setSelectedSize}
                  />
                )}

                {/* Paper Types */}
                {!!product.options?.paperTypes?.length && (
                  <OptionSection
                    title="Paper Type"
                    options={product.options.paperTypes}
                    selected={selectedPaper}
                    setSelected={setSelectedPaper}
                  />
                )}

                {/* Colors */}
                {!!product.options?.colors?.length && (
                  <OptionSection
                    title="Color Theme"
                    options={product.options.colors}
                    selected={selectedColor}
                    setSelected={setSelectedColor}
                  />
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="font-medium text-sm">Quantity</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex border rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.max(product.minQuantity, q - 25),
                        )
                      }
                      className="px-4 py-3 hover:bg-muted transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(product.minQuantity, Number(e.target.value)),
                        )
                      }
                      className="w-24 text-center bg-transparent text-lg font-medium"
                    />

                    <button
                      onClick={() => setQuantity((q) => q + 25)}
                      className="px-4 py-3 hover:bg-muted transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="font-medium text-sm">
                  Upload Your Design
                </label>
                <div className="mt-2 border-2 border-dashed rounded-xl p-8 text-center bg-muted/10 hover:border-primary/50 hover:bg-muted/20 cursor-pointer transition">
                  <Upload className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop file or click to upload
                  </p>
                </div>
              </div>

              {/* ------------ ACTION BUTTONS ----------- */}
              <div className="flex gap-4 pt-6">
                <Button
                  size="xl"
                  variant="gold"
                  className="flex-1 h-14 text-lg font-semibold shadow-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="xl" className="h-14">
                  <Heart />
                </Button>

                <Button variant="outline" size="xl" className="h-14">
                  <Share2 />
                </Button>
              </div>
            </div>
          </div>

          {/* ----------- PRODUCT SPECIFICATIONS ----------- */}
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <DetailCard label="Category" value={product.category} />
              <DetailCard label="Price" value={`₹${product.price}`} />
              {product.discountPrice && (
                <DetailCard
                  label="Discount Price"
                  value={`₹${product.discountPrice}`}
                />
              )}
              <DetailCard
                label="Dimensions"
                value={`${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`}
              />
              <DetailCard label="Stock" value={`${product.stock} units`} />
              <DetailCard label="Slug" value={product.slug} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ----------------------------------------- */
/* OPTION BUTTON GROUP */
function OptionSection({
  title,
  options,
  selected,
  setSelected,
}: {
  title: string;
  options?: string[];
  selected: string;
  setSelected: (v: string) => void;
}) {
  if (!options || options.length === 0) return null;
  return (
    <div>
      <label className="font-medium text-sm">{title}</label>
      <div className="flex gap-2 mt-2 flex-wrap">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm font-medium transition shadow-sm",
              selected === opt
                ? "bg-primary text-white border-primary shadow"
                : "border-gray-300 hover:border-primary hover:bg-primary/5",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------- */
/* DETAIL CARD */
function DetailCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-5 border rounded-xl bg-muted/30 shadow-sm hover:bg-muted/40 transition">
      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-medium text-[15px]">{value}</p>
    </div>
  );
}
