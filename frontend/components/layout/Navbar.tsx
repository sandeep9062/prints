"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingBag, ChevronDown, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import ProfileMenu from "../ProfileMenu";
import ToggleButton from "../ToggleButton";
import SearchBar from "./SearchBar";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

/*
  Design notes
  - Palette: ink blue brand (#2D47BE), warm ivory paper, champagne gold accents.
    Every colour is a semantic token, so the navbar re-themes on its own.
  - One filled button (Order now) and one quiet outline (Log in), instead of
    two competing colours. No lift or slide hover effects.
  - Category names and sub-item strings are unchanged: sub-item text is
    slugified into the ?subcategory= filter, so editing it would break links.
*/

// --- Helpers ---

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const categoryHref = (slug: string) => `/products?category=${slug}`;

const subCategoryHref = (slug: string, sub: string) =>
  `/products?category=${slug}&subcategory=${slugify(sub)}`;

// --- Data ---

const navigationData = [
  {
    name: "Wedding Cards",
    slug: "wedding-cards",
    subItems: [
      "Premium Gold Foil",
      "Floral Suite",
      "Traditional Mandap",
      "Minimalist White",
    ],
  },
  {
    name: "Invitation Cards",
    slug: "invitation-cards",
    subItems: [
      "Birthday Invitations",
      "Anniversary Cards",
      "Corporate Events",
      "Festive Greetings",
    ],
  },
  {
    name: "Visiting Cards",
    slug: "visiting-cards",
    subItems: ["Matte Finish", "Spot UV", "Luxury Velvet", "Eco-friendly Card"],
  },
  {
    name: "Shagun Cards",
    slug: "shagun-cards",
    subItems: [
      "Traditional Designs",
      "Modern Minimal",
      "Gold Foiled",
      "Custom Printed",
    ],
  },
  {
    name: "Letter Pads",
    slug: "letter-pads",
    subItems: [
      "Corporate Letterheads",
      "Personal Stationery",
      "Notepads",
      "Envelopes",
    ],
  },
  {
    name: "Brochures & Catalogs",
    slug: "brochures",
    subItems: [
      "Product Catalogs",
      "Company Brochures",
      "Flyers & Leaflets",
      "Menu Cards",
    ],
  },
] as const;

const HIDDEN_ROUTES = [
  "/admin-dashboard",
  "/merchant-dashboard",
  "/my-account",
  "/auth",
];

// --- Shared styles ---

// Focus ring is the brand colour on every theme; the offset matches the
// surface the control sits on so the ring stays visible in dark mode.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const linkIdle = "text-foreground/75 hover:text-foreground";
const linkActive = "text-foreground";

const primaryBtn =
  "rounded-full bg-primary text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none";

// The outline variant ships `hover:bg-primary hover:text-primary-foreground`, a
// FILL/TEXT PAIR. Overriding only the hover fill (below) left that pair broken:
// tailwind-merge has no hover:text-* to collide with, so `hover:text-primary-
// foreground` survived — white ink on a 5%-tinted paper surface in light mode
// (invisible) and dark ink on dark in dark mode. Re-declaring the hover text is
// what keeps the label readable on hover.
const outlineBtn =
  "rounded-full border-foreground/40 bg-transparent text-foreground transition-colors hover:border-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none";

// Icons use the theme's accent role — foil gold on light surfaces and the same
// gold on deep navy dark surfaces (gold is light enough to read on both).
// Interactive icons deepen to the ink on hover so the control reads as clickable.
// Icons keep the champagne-gold accent, but as the *text* tone on light paper —
// plain gold on white measures 2.42:1, too faint for an icon that is the only
// affordance of its control (WCAG 1.4.11 wants 3:1). On the dark theme plain
// gold is 7.91:1 and needs no adjustment.
const iconAccent = "text-gold-text dark:text-gold";
const iconInteractive =
  "text-gold-text dark:text-gold transition-colors hover:text-foreground motion-reduce:transition-none";

// --- Small pieces ---

const CartBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground ring-2 ring-background">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

// Text wordmark, matching /auth (AuthShell): "INK OF MEMORIES" with the brand
// accent on "OF". Replaces the light/dark logo bitmaps — text re-themes itself
// through the semantic colour tokens, so one element covers both themes.
const Logo = () => (
  <Link
    href="/"
    aria-label="Ink of Memories, go to home page"
    className={cn(
      "shrink-0 rounded-md font-sans text-lg font-semibold tracking-wider text-foreground transition-colors hover:text-brand",
      focusRing,
    )}
  >
    INK <span className="text-primary">OF</span> MEMORIES
  </Link>
);

// --- Component ---

const NavbarInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeCategory =
    pathname === "/products" ? searchParams.get("category") : null;
  const activeSub =
    pathname === "/products" ? searchParams.get("subcategory") : null;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route or filters change
  useEffect(() => {
    setIsOpen(false);
    setOpenMobileSub(null);
  }, [pathname, searchParams]);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (HIDDEN_ROUTES.some((route) => pathname.startsWith(route))) return null;

  const compact = scrolled || isOpen;
  const cartLabel = `Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`;

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl transition-shadow duration-300 motion-reduce:transition-none",
        scrolled && "shadow-[0_12px_28px_-20px_rgba(22,32,79,.35)]",
      )}
    >
      {/* ───────── Row 1: logo + toggle, cart, account ───────── */}
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-300 motion-reduce:transition-none",
            compact ? "h-11" : "h-12",
          )}
        >
          <Logo />

          {/* Search — desktop only; below lg it lives in the mobile panel. */}
          <div className="hidden flex-1 justify-center px-6 lg:flex">
            <SearchBar
              defaultQuery={searchParams.get("search") ?? ""}
              params={{ category: activeCategory ?? undefined }}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <ToggleButton />

            <Link
              href="/favourites"
              aria-label="Favourites"
              className={cn(
                "rounded-full p-2 hover:bg-foreground/10",
                iconInteractive,
                focusRing,
              )}
            >
              <Heart className="h-5 w-5" />
            </Link>

            {mounted ? (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "relative rounded-full hover:bg-foreground/10",
                  iconInteractive,
                  focusRing,
                )}
              >
                <Link href="/cart" aria-label={cartLabel}>
                  <ShoppingBag className="h-5 w-5" />
                  <CartBadge count={totalItems} />
                </Link>
              </Button>
            ) : (
              <div
                aria-hidden="true"
                className="h-10 w-10 animate-pulse rounded-full bg-foreground/10"
              />
            )}

            <Button asChild size="sm" className={cn(primaryBtn, "px-5")}>
              <Link href="/products">Order now</Link>
            </Button>

            {/* Account actions (desktop only; mobile has them in the panel) */}
            <div className="hidden items-center gap-3 lg:flex">
              <div
                aria-hidden="true"
                className="h-6 w-px bg-border"
              />
              {!mounted ? (
                <div
                  aria-hidden="true"
                  className="h-9 w-20 animate-pulse rounded-full bg-foreground/10"
                />
              ) : !isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className={cn(outlineBtn, "px-5")}
                  >
                    <Link href="/auth">Log in</Link>
                  </Button>
                </>
              ) : (
                user && <ProfileMenu user={user} />
              )}
            </div>

            {/* Hamburger (below lg) */}
            <button
              type="button"
              className={cn(
                "rounded-full p-2 hover:bg-foreground/10 lg:hidden",
                iconInteractive,
                focusRing,
              )}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Row 2: navigation (desktop) ───────── */}
      <div className="hidden border-t border-border lg:block">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-stretch justify-center gap-1 xl:gap-2">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "relative flex items-center whitespace-nowrap px-3 text-sm font-medium transition-colors duration-200 xl:px-4",
                focusRing,
                pathname === "/" ? linkActive : linkIdle,
              )}
            >
              Home
              {pathname === "/" && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gold xl:inset-x-4" />
              )}
            </Link>

            {navigationData.map((link) => {
              const active = activeCategory === link.slug;
              return (
                <div key={link.slug} className="group relative flex">
                  <Link
                    href={categoryHref(link.slug)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-1 whitespace-nowrap px-3 text-sm font-medium transition-colors duration-200 xl:px-4",
                      focusRing,
                      active ? linkActive : linkIdle,
                    )}
                  >
                    {link.name}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180 motion-reduce:transition-none",
                        iconAccent,
                      )}
                    />
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-0.5 origin-center bg-gold transition-transform duration-200 motion-reduce:transition-none xl:inset-x-4",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100",
                      )}
                    />
                  </Link>

                  {/* Dropdown: opens on hover and on keyboard focus */}
                  <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
                    <div className="relative mt-px min-w-[240px] rounded-b-sm border border-t-0 border-border bg-ivory py-2 shadow-[0_24px_40px_-20px_rgba(22,32,79,.35)]">
                      {link.subItems.map((sub) => {
                        const subActive = active && activeSub === slugify(sub);
                        return (
                          <Link
                            key={sub}
                            href={subCategoryHref(link.slug, sub)}
                            aria-current={subActive ? "page" : undefined}
                            className={cn(
                              "block px-5 py-2.5 text-sm transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:bg-foreground/5 focus-visible:text-foreground focus-visible:outline-none",
                              subActive
                                ? "font-medium text-foreground shadow-[inset_2px_0_0_hsl(var(--gold))]"
                                : "text-foreground/75",
                            )}
                          >
                            {sub}
                          </Link>
                        );
                      })}
                      <div className="mx-5 my-1.5 h-px bg-border" />
                      <Link
                        href={categoryHref(link.slug)}
                        className="block px-5 py-2 text-xs font-medium text-gold-text underline-offset-4 hover:underline hover:text-foreground focus-visible:underline focus-visible:text-foreground focus-visible:outline-none"
                      >
                        View all {link.name}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Mobile panel. Positioned absolutely inside <nav> with an explicit height:
        a `fixed` child of an element using backdrop-filter is sized against that
        element, not the viewport, which collapses the panel.
        Row 1 is h-11 (2.75rem) plus py-2 (1rem) while the menu is open, so the
        panel fills the rest.
      */}
      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={cn(
          "absolute inset-x-0 top-full h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-contain bg-background transition-all duration-300 ease-out motion-reduce:transition-none lg:hidden",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto max-w-xl px-5 pb-10 pt-4">
          {/* Search — mobile/tablet (the header field is lg and up). */}
          <div className="pb-5">
            <SearchBar
              defaultQuery={searchParams.get("search") ?? ""}
              params={{ category: activeCategory ?? undefined }}
            />
          </div>

          <ul className="flex flex-col">
            <li className="border-y border-border">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={cn(
                  "block py-4 text-lg font-medium transition-colors",
                  focusRing,
                  pathname === "/" ? linkActive : linkIdle,
                )}
              >
                Home
              </Link>
            </li>
            {navigationData.map((link) => {
              const isExpanded = openMobileSub === link.name;
              const active = activeCategory === link.slug;
              const panelId = `mobile-sub-${link.slug}`;

              return (
                <li
                  key={link.slug}
                  className="border-b border-border"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={categoryHref(link.slug)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex-1 py-4 text-lg font-medium transition-colors",
                        focusRing,
                        active ? linkActive : linkIdle,
                      )}
                    >
                      {link.name}
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileSub(isExpanded ? null : link.name)
                      }
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${link.name}`}
                      className={cn(
                        "-mr-2 rounded-full p-2.5 hover:bg-foreground/10",
                        iconInteractive,
                        focusRing,
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 motion-reduce:transition-none",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  <div
                    id={panelId}
                    className={cn(
                      "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "invisible grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col pb-3 pl-2">
                        {link.subItems.map((sub) => {
                          const subActive =
                            active && activeSub === slugify(sub);
                          return (
                            <li key={sub}>
                              <Link
                                href={subCategoryHref(link.slug, sub)}
                                aria-current={subActive ? "page" : undefined}
                                className={cn(
                                  "flex items-center gap-3 py-2.5 text-sm transition-colors",
                                  focusRing,
                                  subActive ? linkActive : linkIdle,
                                  subActive && "font-medium",
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className="h-1 w-1 rounded-full bg-gold"
                                />
                                {sub}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Mobile actions */}
          <div className="mt-8 space-y-3">
            {!mounted ? (
              <div className="h-12 w-full animate-pulse rounded-full bg-foreground/10" />
            ) : !isAuthenticated ? (
              <>
                <Button asChild size="lg" className={cn(primaryBtn, "w-full")}>
                  <Link href="/products">Order now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className={cn(outlineBtn, "w-full")}
                >
                  <Link href="/auth">Log in</Link>
                </Button>
              </>
            ) : (
              <>
                {user && <ProfileMenu user={user} mobile />}
                <Button asChild size="lg" className={cn(primaryBtn, "w-full")}>
                  <Link href="/products">Order now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// useSearchParams needs a Suspense boundary in the App Router.
// Shown while search params resolve, so the logo never disappears.
const NavbarFallback = () => (
  <nav
    aria-label="Main"
    className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95"
  >
    <div className="mx-auto flex h-12 max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
      <Logo />
    </div>
    <div className="hidden h-10 border-t border-border lg:block" />
  </nav>
);

export const Navbar = () => (
  <Suspense fallback={<NavbarFallback />}>
    <NavbarInner />
  </Suspense>
);
