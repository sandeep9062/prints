"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid3X3, LayoutGrid, Palette, Search, SlidersHorizontal, X } from "lucide-react";

import { cn, formatINR } from "@/lib/utils";
import { ProductCard } from "@/components/home/ProductCard";
import { categories as allCategories } from "@/data/products";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import { PriceFilter, ColorFilter } from "./ProductFilters";
import { colorFamilyLabel, productColorFamilies } from "@/lib/productColors";
import type { Product } from "@/services/productsApi";

const categories = [
  "All",
  ...allCategories.filter((c) => c !== "All Products"),
];

/** Query params the filters own. Mirrors the names QuickLinks links with. */
const PARAMS = { minPrice: "minPrice", maxPrice: "maxPrice", color: "color" } as const;

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

/**
 * The price a shopper actually pays. A product with a `discountPrice` is shown
 * and added to the cart at that figure, so the filter must use the same number
 * — filtering on `price` alone would hide discounted items that look like they
 * fall inside the chosen range. ProductCard resolves it the same way.
 */
const effectivePrice = (product: Product) => product.discountPrice || product.price;

/** Parses a `minPrice`/`maxPrice` param, ignoring anything non-numeric. */
const parseBound = (raw: string | null): number | null => {
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

function ProductsContent({ initialProducts }: ProductsListClientProps) {
  const products = initialProducts;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  // Panels are collapsible on desktop and hidden behind the toggle on mobile.
  const [showFilters, setShowFilters] = useState(false);

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

  /* ---------------- PRICE + COLOUR FILTERS (URL-driven) ----------------- */
  // Both filters live in the query string rather than component state so the
  // homepage QuickLinks deep links (/products?color=maroon, ?minPrice=100) land
  // pre-filtered, the URL is shareable, and back/forward works for free.
  const selectedMin = parseBound(searchParams.get(PARAMS.minPrice));
  const selectedMax = parseBound(searchParams.get(PARAMS.maxPrice));

  // Repeated `color` params let a shopper select several colours; a single
  // comma-joined value is accepted too so hand-written links work.
  const selectedColors = useMemo(() => {
    const raw = searchParams.getAll(PARAMS.color);
    const values = raw.flatMap((value) => value.split(","));
    return Array.from(
      new Set(values.map((v) => v.trim().toLowerCase()).filter(Boolean)),
    );
  }, [searchParams]);

  /**
   * Rewrites the query string, preserving the filters this handler doesn't
   * touch. Building on the existing params (rather than a fresh
   * `URLSearchParams`) is what keeps `?category=` and `?search=` alive when a
   * shopper adjusts the price — and what stops `handleCategoryChange` from
   * wiping a colour selection.
   */
  const pushParams = (
    updates: Record<string, string | string[] | null>,
    options?: { keepScroll?: boolean },
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      for (const entry of Array.isArray(value) ? value : [value]) {
        if (entry !== "") params.append(key, entry);
      }
    }

    const query = params.toString();
    // `scroll: false` keeps a slider drag from jumping the page to the top on
    // every commit.
    router.push(query ? `?${query}` : "?", { scroll: !options?.keepScroll });
  };

  /* ---------------- CATALOGUE PRICE + COLOUR FACETS ----------------- */
  // Derived from the whole catalogue, not the currently filtered subset, so
  // the slider bounds and the per-colour counts don't shrink every time a
  // filter is applied (otherwise each tick would move the range under the
  // shopper's thumb).
  const { priceBounds, colorCounts } = useMemo(() => {
    const prices = products.map(effectivePrice).filter((p) => Number.isFinite(p) && p > 0);

    const bounds =
      prices.length > 0
        ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
        : { min: 0, max: 0 };

    const counts: Record<string, number> = {};
    for (const product of products) {
      // A product's families are counted once each — "White with Gold" must
      // not inflate both the white and the gold count for the same item.
      for (const slug of productColorFamilies(product.options?.colors)) {
        counts[slug] = (counts[slug] ?? 0) + 1;
      }
    }

    return { priceBounds: bounds, colorCounts: counts };
  }, [products]);

  const activeFilterCount =
    (selectedMin !== null || selectedMax !== null ? 1 : 0) + selectedColors.length;

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

    if (selectedMin !== null || selectedMax !== null) {
      filtered = filtered.filter((p) => {
        const price = effectivePrice(p);
        // A product with no usable price can't satisfy a priced range, so it's
        // dropped rather than treated as ₹0 and matched by a "under ₹100" band.
        if (!Number.isFinite(price) || price <= 0) return false;
        if (selectedMin !== null && price < selectedMin) return false;
        if (selectedMax !== null && price > selectedMax) return false;
        return true;
      });
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => {
        const families = productColorFamilies(p.options?.colors);
        // Colours are OR'd (any selected colour matches), which is what a
        // multi-select facet means. A product can satisfy several at once
        // ("White with Gold" matches white AND gold) but is listed once.
        return selectedColors.some((slug) => families.has(slug));
      });
    }

    return filtered;
  }, [
    categoryParam,
    searchQuery,
    selectedMin,
    selectedMax,
    selectedColors,
    products,
  ]);

  /* ---------------- FILTER HANDLERS ----------------- */
  const handlePriceChange = (min: number | null, max: number | null) => {
    pushParams(
      {
        [PARAMS.minPrice]: min === null ? null : String(min),
        [PARAMS.maxPrice]: max === null ? null : String(max),
      },
      { keepScroll: true },
    );
  };

  const handleColorToggle = (slug: string) => {
    const next = selectedColors.includes(slug)
      ? selectedColors.filter((c) => c !== slug)
      : [...selectedColors, slug];

    pushParams({ [PARAMS.color]: next }, { keepScroll: true });
  };

  const clearFilters = () => {
    pushParams(
      {
        [PARAMS.minPrice]: null,
        [PARAMS.maxPrice]: null,
        [PARAMS.color]: null,
      },
      { keepScroll: true },
    );
  };

  /* ---------------- CATEGORY CHANGE ----------------- */
  const handleCategoryChange = (category: string) => {
    pushParams({ category: category === "All" ? null : slugify(category) });
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
{/* Search + filters + view toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filters toggle. The badge counts the active price range as one
                  entry plus one per colour, so it reads as "3 filters" rather
                  than counting the two price thumbs separately. */}
              <button
                type="button"
                onClick={() => setShowFilters((open) => !open)}
                aria-expanded={showFilters}
                aria-controls="product-filters"
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-none border px-3 text-[10px] font-semibold transition-colors duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
                  showFilters || activeFilterCount > 0
                    ? "border-brand text-brand"
                    : "border-border text-muted-foreground hover:border-brand hover:text-foreground dark:border-border dark:text-muted-foreground dark:hover:text-foreground/40",
                )}
              >
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center bg-brand px-1 text-[9px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>

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

          {/* Price + colour filters. Collapsed by default so the catalogue is
              the first thing on screen; the toolbar button opens it. */}
          {showFilters && (
            <div
              id="product-filters"
              className="mb-6 grid gap-8 border border-border p-5 sm:mb-8 sm:grid-cols-2 sm:p-6 lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10 dark:border-border"
            >
              <PriceFilter
                min={priceBounds.min}
                max={priceBounds.max}
                selectedMin={selectedMin}
                selectedMax={selectedMax}
                onChange={handlePriceChange}
              />
              {/* Full-bleed on the second column so the 3-up swatch grid keeps
                  its natural width instead of being squeezed by the price
                  column beside it. */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ColorFilter
                  selected={selectedColors}
                  counts={colorCounts}
                  onToggle={handleColorToggle}
                  onClear={() =>
                    pushParams({ [PARAMS.color]: null }, { keepScroll: true })
                  }
                />
              </div>
            </div>
          )}

          {/* Active filter chips — a summary the shopper can undo one at a
              time without reopening the panel. */}
          {activeFilterCount > 0 && (
            <ul className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
              {selectedColors.map((slug) => (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => handleColorToggle(slug)}
                    className="inline-flex h-8 items-center gap-1.5 border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-border dark:text-foreground dark:hover:text-brand"
                  >
                    <Palette aria-hidden="true" className="h-3 w-3" />
                    {colorFamilyLabel(slug)}
                    <X aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">Remove colour filter</span>
                  </button>
                </li>
              ))}

              {(selectedMin !== null || selectedMax !== null) && (
                <li>
                  <button
                    type="button"
                    onClick={() => handlePriceChange(null, null)}
                    className="inline-flex h-8 items-center gap-1.5 border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-border dark:text-foreground dark:hover:text-brand"
                  >
                    {selectedMin !== null && selectedMax !== null
                      ? `${formatINR(selectedMin)} – ${formatINR(selectedMax)}`
                      : selectedMin !== null
                        ? `${formatINR(selectedMin)} & up`
                        : `Up to ${formatINR(selectedMax)}`}
                    <X aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">Remove price filter</span>
                  </button>
                </li>
              )}

              {activeFilterCount > 1 && (
                <li>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-8 px-2 text-[10px] font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-muted-foreground"
                  >
                    Clear all
                  </button>
                </li>
              )}
            </ul>
          )}

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
                // The whole set, so the card can cycle through every frame.
                images: product?.images || [],
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
                {activeFilterCount > 0
                  ? "Try widening your price range or clearing a colour — every filter you have set is listed above."
                  : "Try another category, or browse the full catalogue to explore everything we press in-house."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  // One navigation, not three: handleCategoryChange and
                  // clearFilters each push their own entry, which would leave
                  // the shopper pressing Back twice to escape the empty state.
                  pushParams({
                    category: null,
                    search: null,
                    [PARAMS.minPrice]: null,
                    [PARAMS.maxPrice]: null,
                    [PARAMS.color]: null,
                  });
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
