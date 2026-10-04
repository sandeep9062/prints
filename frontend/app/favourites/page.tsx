"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/home/ProductCard";
import PageHeader from "@/components/editorial/PageHeader";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetFavouritesQuery, useToFavMutation } from "@/services/userApi";

/*
  Favourites — the destination of the Navbar's Heart link.

  Data
  - Reads the user's wishlist through `useGetFavouritesQuery`
    (GET /v1/users/favourites, populated products) and removes entries with
    `useToFavMutation` (POST /v1/users/toFav/:id, which toggles). The mutation
    invalidates the "User" tag that the list provides, so removing a piece
    refreshes the grid on its own.

  Design
  - Editorial treatment copied from /products so the page reads as one system:
    a tracked eyebrow, serif headline, hairline rules and a stone palette with
    a red accent.
*/

type FavouriteProduct = {
  _id: string;
  id?: string;
  slug?: string;
  name: string;
  category?: string;
  badge?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  description?: string;
  featured?: boolean;
  minQuantity?: number;
  stock?: number;
};

// Hydration-safe "are we on the client yet?" flag. `useSyncExternalStore`
// returns false during SSR and true once hydrated, without a setState-in-effect.
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const useMounted = () =>
  useSyncExternalStore(subscribeToNothing, getClientSnapshot, getServerSnapshot);

const ctaClass =
  "mt-8 inline-flex items-center gap-2 rounded-none border border-brand/50 px-8 py-4 text-[11px] font-semibold text-brand transition-colors duration-300 hover:bg-brand-hover hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-destructive/50 dark:text-brand dark:focus-visible:ring-offset-footer";

export default function FavouritesPage() {
  const mounted = useMounted();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toFav] = useToFavMutation();

  const { data, isLoading, isError, refetch } = useGetFavouritesQuery(
    undefined,
    { skip: !mounted || !isAuthenticated },
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Favourites", url: "/favourites" },
  ]);

  // The endpoint returns the whole envelope ({ success, favourites }); accept a
  // bare array too so the shape can change without breaking the page.
  const favourites = useMemo<FavouriteProduct[]>(() => {
    const raw = data as unknown as
      | FavouriteProduct[]
      | { favourites?: FavouriteProduct[] }
      | undefined;
    if (!raw) return [];
    const list = Array.isArray(raw) ? raw : raw.favourites;
    return Array.isArray(list) ? list.filter((item) => item && item.name) : [];
  }, [data]);

  const handleRemove = async (item: FavouriteProduct) => {
    const id = item._id || item.id;
    if (!id) return;

    setRemovingId(id);
    try {
      await toFav({ id, product: item }).unwrap();
      toast.success("Removed from favourites");
    } catch (error) {
      const err = error as { data?: { message?: string }; error?: string };
      toast.error(
        err?.data?.message || err?.error || "Couldn't remove that just now.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const showSkeleton = !mounted || (isAuthenticated && isLoading);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Favourites"
        description="Your saved printing pieces — wedding cards, visiting cards, brochures and more, kept together so you can return to them any time."
        path="/favourites"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="saved printing products, favourite cards, wishlist, Ink of Memories favourites"
        jsonLd={breadcrumbSchema}
        noIndex
      />

      <main className="pb-24 pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          <PageHeader
            eyebrow="Your Collection"
            title="Saved"
            accent="Treasures"
            description="Pieces you've bookmarked while browsing. Keep them here for later, or send a favourite straight to your cart."
          />

          {/* Hydrating / loading */}
          {showSkeleton && (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] w-full bg-muted dark:bg-card" />
                  <div className="mt-5 h-2.5 w-24 bg-muted dark:bg-card" />
                  <div className="mt-3 h-4 w-40 bg-muted dark:bg-card" />
                  <div className="mt-3 h-3 w-16 bg-muted dark:bg-card" />
                </div>
              ))}
            </div>
          )}

          {/* Signed out */}
          {mounted && !isAuthenticated && (
            <div className="mt-12 flex flex-col items-center border border-border py-24 text-center dark:border-border">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted dark:bg-card">
                <Heart
                  aria-hidden="true"
                  className="h-9 w-9 text-muted-foreground dark:text-muted-foreground"
                  strokeWidth={1.4}
                />
              </div>
              <p className="mt-7 font-sans text-2xl text-foreground dark:text-muted-foreground/70">
                Sign in to see your favourites
              </p>
              <p className="mt-3 max-w-sm text-sm font-normal text-muted-foreground dark:text-muted-foreground">
                Your saved pieces are tied to your account, so they follow you
                across every device.
              </p>
              <Link href="/auth" className={ctaClass}>
                Sign in
              </Link>
            </div>
          )}

          {/* Signed in, request failed */}
          {mounted && isAuthenticated && isError && (
            <div className="mt-12 flex flex-col items-center border border-border py-24 text-center dark:border-border">
              <p className="font-sans text-2xl text-foreground dark:text-muted-foreground/70">
                We couldn&apos;t load your favourites.
              </p>
              <p className="mt-3 max-w-sm text-sm font-normal text-muted-foreground dark:text-muted-foreground">
                Something went wrong on the way to the press. Give it another
                try.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className={ctaClass}
              >
                Try again
              </button>
            </div>
          )}

          {/* Signed in, nothing saved */}
          {mounted &&
            isAuthenticated &&
            !isLoading &&
            !isError &&
            favourites.length === 0 && (
              <div className="mt-12 flex flex-col items-center border border-border py-24 text-center dark:border-border">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted dark:bg-card">
                  <Heart
                    aria-hidden="true"
                    className="h-9 w-9 text-muted-foreground dark:text-muted-foreground"
                    strokeWidth={1.4}
                  />
                </div>
                <p className="mt-7 font-sans text-2xl text-foreground dark:text-muted-foreground/70">
                  No favourites yet
                </p>
                <p className="mt-3 max-w-sm text-sm font-normal text-muted-foreground dark:text-muted-foreground">
                  Tap the heart on any piece in the catalogue and it will be kept
                  here for you.
                </p>
                <Link href="/products" className={ctaClass}>
                  Browse the catalogue
                </Link>
              </div>
            )}

          {/* Populated */}
          {mounted &&
            isAuthenticated &&
            !isLoading &&
            favourites.length > 0 && (
              <>
                <p
                  aria-live="polite"
                  className="mb-8 mt-12 text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground"
                >
                  {favourites.length}{" "}
                  {favourites.length === 1 ? "piece" : "pieces"} saved
                </p>

                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favourites.map((item, index) => {
                    const id = item._id || item.id || `${item.name}-${index}`;
                    const onSale =
                      !!item.discountPrice && item.discountPrice < item.price;

                    return (
                      <div key={id}>
                        <ProductCard
                          product={{
                            id,
                            slug: item.slug || id,
                            name: item.name,
                            category: item.category || "",
                            price: onSale ? item.discountPrice! : item.price,
                            originalPrice: onSale ? item.price : undefined,
                            image: item.images?.[0] || "/placeholder.svg",
                            // The whole set, so the card can cycle through
                            // every frame.
                            images: item.images || [],
                            badge: item.badge,
                            description: item.description,
                            featured: item.featured,
                            minQuantity: item.minQuantity,
                            stock: item.stock,
                          }}
                          index={index}
                        />

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 dark:border-border">
                          <span className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground">
                            Saved
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            disabled={removingId === id}
                            aria-label={`Remove ${item.name} from favourites`}
                            className={cn(
                              "inline-flex items-center gap-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 dark:text-muted-foreground dark:hover:text-brand dark:focus-visible:ring-offset-footer",
                            )}
                          >
                            {removingId === id ? (
                              <Loader2
                                aria-hidden="true"
                                className="h-3.5 w-3.5 animate-spin"
                              />
                            ) : (
                              <Heart
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                            )}
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  );
}