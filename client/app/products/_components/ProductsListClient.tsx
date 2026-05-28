"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid3X3, LayoutGrid, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/home/ProductCard";
import { categories as allCategories } from "@/data/products";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import type { Product } from "@/services/productsApi";

const categories = [
  "All",
  ...allCategories.filter((c) => c !== "All Products"),
];

interface ProductsListClientProps {
  initialProducts: Product[];
}

function ProductsContent({ initialProducts }: ProductsListClientProps) {
  const products = initialProducts;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryParam = searchParams.get("category") || "All";

  /* ---------------- FILTER PRODUCTS ----------------- */
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryParam !== "All") {
      filtered = filtered.filter(
        (p: any) =>
          p.category?.toLowerCase().replace(/\s+/g, "-") ===
          categoryParam.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [categoryParam, searchQuery, products]);

  /* ---------------- CATEGORY CHANGE ----------------- */
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();

    if (category !== "All") {
      params.set("category", category.toLowerCase().replace(/\s+/g, "-"));
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Shop Printing Products – Wedding Cards, Visiting Cards & More"
        description="Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs. Shop with Samlason Printing Press."
        path="/products"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="buy printing products, wedding cards online, visiting cards India, brochure printing, custom printing shop"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Our Products
            </h1>
            <p className="text-muted-foreground">
              Discover our premium printing products designed with quality and
              care.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 12).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    categoryParam ===
                      category.toLowerCase().replace(/\s+/g, "-") ||
                      (category === "All" && !categoryParam)
                      ? "bg-red-900 text-primary-foreground dark:text-white"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border bg-background"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === "large" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("large")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {filteredProducts.map((product: any, index: number) => {
              // Map API product to match ProductCard props format
              const formattedProduct = {
                id: product.slug || product._id,
                name: product.name,
                category: product.category,
                price: product.discountPrice || product.price,
                originalPrice: product.discountPrice
                  ? product.price
                  : undefined,
                image: product?.images?.[0] || "/placeholder.svg",
                badge: product.badge,
              };

              return (
                <ProductCard
                  key={product._id}
                  product={formattedProduct}
                  index={index}
                />
              );
            })}
          </div>

          {/* No Products */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProductsListClient({
  initialProducts,
}: ProductsListClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-lg font-medium animate-pulse">
            Loading products...
          </span>
        </div>
      }
    >
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
