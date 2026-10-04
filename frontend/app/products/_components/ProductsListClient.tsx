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
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Shop Printing Products – Wedding Cards, Visiting Cards & More"
        description="Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs. Shop with Ink of Memories."
        path="/products"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="buy printing products, wedding cards online, visiting cards India, brochure printing, custom printing shop"
        jsonLd={breadcrumbSchema}
      />
      <main className="pb-24 pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial header — mirrors CategoriesSection / FeaturedProducts */}
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-6 sm:mb-10 sm:gap-6 md:flex-row md:items-end dark:border-border">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold text-muted-foreground dark:text-muted-foreground">
                Curated Suites
              </span>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
                The Complete{" "}
                <em className="font-medium text-primary">
                  Collection
                </em>
              </h1>
            </div>
            <p className="mt-3 max-w-xs text-sm italic text-muted-foreground sm:mt-4 md:mt-0 dark:text-muted-foreground">
              Every suite is pressed, foiled and finished in-house at Ink of Memories
              Printing Press.
            </p>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Category filters — a snap scroller on small screens. The scrollbar
                is hidden (same treatment as the home page FeaturedProducts
                carousel) so the rail doesn't double up with the page scroll. */}
            <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:pb-0">
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
                      // py-3 on phones lifts the chip to a ~44px tap target
                      // (WCAG 2.5.8); it tightens back to py-2.5 from `sm` up,
                      // where the chips sit in a wrapped row rather than a
                      // thumb-scrolled rail.
                      "shrink-0 snap-start rounded-none border px-4 py-3 text-[10px] font-semibold transition-colors duration-300 sm:py-2.5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-footer",
                      active
                        ? "border-foreground bg-primary text-primary-foreground dark:border-border dark:bg-muted dark:text-foreground"
                        : "border-border text-muted-foreground hover:border-brand hover:text-foreground dark:border-border dark:text-muted-foreground dark:hover:border-foreground/40 dark:hover:text-muted-foreground/70",
                    )}
                  >
                    {category === "All" ? "All Suites" : category}
                  </button>
                );
              })}
            </div>
{/* Search + view toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* min-w-0 lets the field actually shrink instead of forcing the
                  row wider than a 320px screen. */}
              <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
                <label htmlFor="product-search" className="sr-only">
                  Search products
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground"
                />
                <input
                  id="product-search"
                  type="search"
                  placeholder="Search the collection"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-none border border-border bg-transparent py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/60 focus:ring-1 focus:ring-brand dark:border-border dark:text-muted-foreground/70 dark:placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex shrink-0 items-center gap-px bg-muted dark:bg-card">
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
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:text-foreground dark:bg-card dark:text-muted-foreground dark:hover:text-muted-foreground/70",
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
            className="mb-6 text-[10px] font-semibold text-muted-foreground sm:mb-8 dark:text-muted-foreground"
          >
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "suite" : "suites"}
            {categoryParam !== "All" && (
              <>
                {" "}in{" "}
                <span className="text-brand">
                  {categoryLabel}
                </span>
              </>
            )}
          </p>

          {/* Products Grid
            Mobile gets an explicit 2-up grid. Previously there was no base
            column at all, so phones fell back to `grid-template-columns: none`
            and rendered one card per row — at 4/5 aspect a single card is ~500px
            tall on a 375px screen, so barely one product was visible at a time.
            "Large" view intentionally stays single-column on phones: that is
            the whole point of the toggle. The tighter mobile gutters/gaps hand
            the cards back the width the 2-up layout takes from them
            (gap-x-4 vs gap-x-8 is 16px back on every card). */}
          <div
            className={cn(
              "grid gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14",
              viewMode === "grid"
                ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2",
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
                minQuantity: product.minQuantity,
                stock: product.stock,
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
            <div className="flex flex-col items-center border border-border py-16 text-center sm:py-24 dark:border-border">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-muted dark:bg-muted" />
                <span className="text-[10px] font-bold text-muted-foreground dark:text-muted-foreground">
                  Empty Press
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-muted dark:bg-muted" />
              </div>
              <p className="mt-6 font-sans text-2xl text-foreground dark:text-muted-foreground/70">
                No suites match your search.
              </p>
              <p className="mt-3 max-w-sm text-sm font-normal text-muted-foreground dark:text-muted-foreground">
                Try another category, or browse the full catalogue to explore
                everything we press in-house.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  if (categoryParam !== "All") handleCategoryChange("All");
                }}
                className="mt-8 rounded-none border border-brand/50 px-8 py-4 text-[11px] font-semibold text-brand transition-colors duration-300 hover:bg-brand-hover hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/50 dark:text-brand dark:focus-visible:ring-offset-footer"
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
        <div className="flex min-h-[60vh] items-center justify-center bg-background">
          <span className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground">
            Loading the catalogue
          </span>
        </div>
      }
    >
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
