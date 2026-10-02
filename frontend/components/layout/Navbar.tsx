"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingBag, ChevronDown, Feather, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import ProfileMenu from "../ProfileMenu";
import ToggleButton from "../ToggleButton";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0f111a]";

// --- Small pieces ---

const CartBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:ring-[#0f111a]">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

const Logo = () => (
  <Link
    href="/"
    aria-label="Ink of Memories, go to home page"
    className={cn("group flex shrink-0 items-center rounded-md", focusRing)}
  >
    <Image
      src="/inkofmemories.png"
      alt="Ink of Memories"
      className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] lg:h-24 dark:hidden"
      width={100}
      height={60}
      priority
    />
    <Image
      src="/inkofmemories-dark.png"
      alt="Ink of Memories"
      className="hidden h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] lg:h-9 dark:block"
      width={140}
      height={60}
      priority
    />
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
        "fixed inset-x-0 top-0 z-50 border-b bg-white backdrop-blur-xl transition-shadow duration-300 dark:bg-[#0f111a]/90 motion-reduce:transition-none",
        scrolled
          ? "border-stone-200/80 shadow-md shadow-stone-200/40 dark:border-stone-800 dark:shadow-none"
          : "border-stone-200/60 dark:border-stone-800/80",
      )}
    >
      {/* Decorative top hairline (absolute so it never affects header height) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      {/* ───────── Row 1: logo + toggle, cart, login ───────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-300 motion-reduce:transition-none",
            compact ? "h-11" : "h-12",
          )}
        >
          <Logo />

          <div className="flex items-center gap-1.5 sm:gap-3">
            <ToggleButton />

            {mounted ? (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Link href="/cart" aria-label={cartLabel}>
                  <ShoppingBag className="h-5 w-5" />
                  <CartBadge count={totalItems} />
                </Link>
              </Button>
            ) : (
              <div
                aria-hidden="true"
                className="h-10 w-10 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"
              />
            )}

            {/* Login / profile (desktop only; mobile has it in the panel) */}
            <div className="hidden items-center gap-3 lg:flex">
              <div
                aria-hidden="true"
                className="h-6 w-px bg-stone-200 dark:bg-stone-700"
              />
              {!mounted ? (
                <div
                  aria-hidden="true"
                  className="h-9 w-20 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"
                />
              ) : !isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    className="group rounded-full bg-red-900 px-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:bg-red-800 dark:hover:bg-red-700 dark:focus-visible:ring-red-600 dark:focus-visible:ring-offset-[#0f111a]"
                  >
                    <Link href="/products">
                      Order Now
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-gradient-to-tr from-green-600 to-green-700 px-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:from-green-700 hover:to-green-600 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <Link href="/auth">Login</Link>
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
                "rounded-full p-2 text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800 lg:hidden",
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
      <div className="hidden border-t border-stone-200/60 dark:border-stone-800/80 lg:block">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-9 items-stretch justify-center gap-1 xl:gap-2">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "relative flex items-center whitespace-nowrap px-3 text-sm font-medium tracking-tight transition-colors duration-200 xl:px-4",
                focusRing,
                pathname === "/"
                  ? "text-primary"
                  : "text-stone-600 hover:text-primary dark:text-stone-300",
              )}
            >
              Home
              {pathname === "/" && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary xl:inset-x-4" />
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
                      "relative flex items-center gap-1 whitespace-nowrap px-3 text-sm font-medium tracking-tight transition-colors duration-200 xl:px-4",
                      focusRing,
                      active
                        ? "text-primary"
                        : "text-stone-600 hover:text-primary dark:text-stone-300",
                    )}
                  >
                    {link.name}
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180 group-hover:text-primary motion-reduce:transition-none"
                    />
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary transition-transform duration-200 origin-center motion-reduce:transition-none xl:inset-x-4",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100",
                      )}
                    />
                  </Link>

                  {/* Dropdown: opens on hover and on keyboard focus */}
                  <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
                    <div className="relative mt-px min-w-[230px] overflow-hidden rounded-b-2xl border border-t-0 border-stone-200/70 bg-white py-2 shadow-xl shadow-stone-900/10 dark:border-stone-800 dark:bg-[#171a29] dark:shadow-black/40">
                      {link.subItems.map((sub) => {
                        const subActive = active && activeSub === slugify(sub);
                        return (
                          <Link
                            key={sub}
                            href={subCategoryHref(link.slug, sub)}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary focus-visible:bg-primary/5 focus-visible:text-primary focus-visible:outline-none dark:hover:bg-primary/10",
                              subActive
                                ? "font-medium text-primary"
                                : "text-stone-600 dark:text-stone-300",
                            )}
                          >
                            {sub}
                          </Link>
                        );
                      })}
                      <div className="mx-4 my-1.5 h-px bg-stone-200/70 dark:bg-stone-800" />
                      <Link
                        href={categoryHref(link.slug)}
                        className="block px-4 py-2 text-xs font-medium text-primary hover:underline focus-visible:underline focus-visible:outline-none"
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
          "absolute inset-x-0 top-full h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-contain bg-white transition-all duration-300 ease-out dark:bg-[#0f111a] motion-reduce:transition-none lg:hidden",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto max-w-xl px-5 pb-10 pt-4">
          <ul className="flex flex-col">
            <li className="border-b border-t border-stone-100 dark:border-stone-800">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={cn(
                  "block py-4 text-base font-medium transition-colors",
                  pathname === "/"
                    ? "text-primary"
                    : "text-stone-700 dark:text-stone-200",
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
                  className="border-b border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={categoryHref(link.slug)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex-1 py-4 text-base font-medium transition-colors",
                        active
                          ? "text-primary"
                          : "text-stone-700 dark:text-stone-200",
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
                        "-mr-2 rounded-full p-2.5 text-stone-400 transition-colors hover:text-primary",
                        focusRing,
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 motion-reduce:transition-none",
                          isExpanded && "rotate-180 text-primary",
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
                                className={cn(
                                  "flex items-center gap-2.5 py-2.5 text-sm transition-colors hover:text-primary",
                                  subActive
                                    ? "font-medium text-primary"
                                    : "text-stone-500 dark:text-stone-400",
                                )}
                              >
                                <span className="h-1 w-1 rounded-full bg-primary/40" />
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
          <div className="mt-6 space-y-3">
            {!mounted ? (
              <div className="h-12 w-full animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
            ) : !isAuthenticated ? (
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-primary font-medium text-white shadow-md hover:bg-primary/90"
              >
                <Link href="/auth">Login</Link>
              </Button>
            ) : (
              user && <ProfileMenu user={user} mobile />
            )}

            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-foreground text-white dark:bg-red-800"
            >
              <Link href="/products">
                <Feather className="mr-2 h-4 w-4" />
                Order Now
              </Link>
            </Button>
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
    className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/60 bg-white/90 dark:border-stone-800/80 dark:bg-[#0f111a]/90"
  >
    <div className="mx-auto flex h-12 max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
      <Logo />
    </div>
    <div className="hidden h-9 border-t border-stone-200/60 dark:border-stone-800/80 lg:block" />
  </nav>
);

export const Navbar = () => (
  <Suspense fallback={<NavbarFallback />}>
    <NavbarInner />
  </Suspense>
);
