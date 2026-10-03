"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid3X3, LayoutGrid, Search } from "lucide-react";

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

/** Matches the Navbar's slug rules so deep links keep working. */
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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

  // The term is URL-driven so a navbar search (`/products?search=…`) lands
  // filtered. Typing updates local state instantly; a term arriving in the URL
  // is folded back in during render (React's "adjust state when a prop changes"
  // pattern) so no effect is needed.
  const searchParam = searchParams.get("search") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [syncedSearch, setSyncedSearch] = useState(searchParam);
  if (searchParam !== syncedSearch) {
    setSyncedSearch(searchParam);
    setSearchQuery(searchParam);
  }

  const categoryParam = searchParams.get("category") || "All";

  // Human-readable label for the counter, e.g. "wedding-cards" -> "Wedding Cards".
  const categoryLabel =
    categories.find((c) => slugify(c) === categoryParam) || categoryParam;

  /* ---------------- FILTER PRODUCTS ----------------- */
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryParam !== "All") {
      filtered = filtered.filter(
        (p) => slugify(p.category || "") === categoryParam,
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
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
      params.set("category", slugify(category));
    }

    router.push(params.toString() ? `?${params.toString()}` : "?");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] dark:bg-[#0f111a]">
      <SEOHelper
        title="Shop Printing Products – Wedding Cards, Visiting Cards & More"
        description="Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs. Shop with Samlason Printing Press."
        path="/products"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="buy printing products, wedding cards online, visiting cards India, brochure printing, custom printing shop"
        jsonLd={breadcrumbSchema}
      />
      <main className="pb-24 pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          {/* Editorial header — mirrors CategoriesSection / FeaturedProducts */}
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-stone-200 pb-6 md:flex-row md:items-end dark:border-stone-700">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
                Curated Suites
              </span>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 md:text-5xl dark:text-stone-100">
                The Complete{" "}
                <em className="font-light text-red-800 dark:text-red-600">
                  Collection
                </em>
              </h1>
            </div>
            <p className="mt-4 max-w-xs text-sm italic text-stone-500 md:mt-0 dark:text-stone-400">
              Every suite is pressed, foiled and finished in-house at Samlason
              Printing Press.
            </p>
          </div>

          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Category filters — horizontally scrollable on small screens */}
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
              {categories.map((category) => {
                const active =
                  category === "All"
                    ? categoryParam === "All"
                    : categoryParam === slugify(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    aria-pressed={active}
                    className={cn(
                      "shrink-0 snap-start rounded-none border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f111a]",
                      active
                        ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                        : "border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100",
                    )}
                  >
                    {category === "All" ? "All Suites" : category}
                  </button>
                );
              })}
            </div>
{/* Search + view toggle */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64 sm:flex-none">
                <label htmlFor="product-search" className="sr-only">
                  Search products
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                />
                <input
                  id="product-search"
                  type="search"
                  placeholder="Search the collection"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-none border border-stone-200 bg-transparent py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder-stone-400 focus:border-red-800 focus:ring-1 focus:ring-red-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500"
                />
              </div>

              <div className="flex items-center gap-px bg-stone-200 dark:bg-stone-700">
                {(
                  [
                    { mode: "grid", label: "Grid view", Icon: Grid3X3 },
                    { mode: "large", label: "Large view", Icon: LayoutGrid },
                  ] as const
                ).map(({ mode, label, Icon }) => {
                  const active = viewMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={active}
                      aria-label={label}
                      title={label}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center transition-colors duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-800",
                        active
                          ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                          : "bg-[#FCFBF9] text-stone-400 hover:text-stone-900 dark:bg-[#0f111a] dark:text-stone-500 dark:hover:text-stone-100",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result count */}
          <p
            aria-live="polite"
            className="mb-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500"
          >
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "suite" : "suites"}
            {categoryParam !== "All" && (
              <>
                {" "}in{" "}
                <span className="text-red-800 dark:text-red-600">
                  {categoryLabel}
                </span>
              </>
            )}
          </p>

          {/* Products Grid */}
          <div
            className={cn(
              "grid gap-x-8 gap-y-14",
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "sm:grid-cols-2",
            )}
          >
            {filteredProducts.map((product, index) => {
              // Map API product to match ProductCard props format
              const formattedProduct = {
                id: product._id,
                slug: product.slug || product._id,
                name: product.name,
                category: product.category,
                price: product.discountPrice || product.price,
                originalPrice:
                  product.discountPrice &&
                  product.discountPrice < product.price
                    ? product.price
                    : undefined,
                image: product?.images?.[0] || "/placeholder.svg",
                badge: product.badge,
                description: product.description,
                featured: product.featured,
              };

              return (
                <ProductCard
                  key={product._id}
                  product={formattedProduct}
                  index={index}
                  showDescription={viewMode === "large"}
                />
              );
            })}
          </div>
{/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center border border-stone-200 py-24 text-center dark:border-stone-700">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
                  Empty Press
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
              </div>
              <p className="mt-6 font-serif text-2xl text-stone-900 dark:text-stone-100">
                No suites match your search.
              </p>
              <p className="mt-3 max-w-sm text-sm font-light text-stone-500 dark:text-stone-400">
                Try another category, or browse the full catalogue to explore
                everything we press in-house.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  if (categoryParam !== "All") handleCategoryChange("All");
                }}
                className="mt-8 rounded-none border border-red-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-900 transition-colors duration-300 hover:bg-red-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 dark:border-red-800 dark:text-red-400 dark:focus-visible:ring-offset-[#0f111a]"
              >
                View All Suites
              </button>
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
        <div className="flex min-h-[60vh] items-center justify-center bg-[#FCFBF9] dark:bg-[#0f111a]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
            Loading the catalogue
          </span>
        </div>
      }
    >
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
