"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import ProfileMenu from "../ProfileMenu";
import ToggleButton from "../ToggleButton";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

/*
  Design notes
  - Palette matches the hero: pale sage paper, bottle-green ink (#1F3A32),
    foil-gold accents (#B08D4A), wax-rose cart badge (#A24B4B).
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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F5EE] dark:focus-visible:ring-offset-[#16211D]";

const linkIdle =
  "text-[#1F3A32]/75 hover:text-[#1F3A32] dark:text-[#E4E9DD]/75 dark:hover:text-white";
const linkActive = "text-[#1F3A32] dark:text-white";

const primaryBtn =
  "rounded-full bg-[#1F3A32] text-[#F7F4EE] transition-colors hover:bg-[#2B4F44] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:bg-[#F7F4EE] dark:text-[#1F3A32] dark:hover:bg-white dark:focus-visible:ring-offset-[#16211D] motion-reduce:transition-none";

const outlineBtn =
  "rounded-full border-[#1F3A32]/40 bg-transparent text-[#1F3A32] transition-colors hover:border-[#1F3A32] hover:bg-[#1F3A32]/5 hover:text-[#1F3A32] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 dark:border-[#E4E9DD]/40 dark:text-[#F7F4EE] dark:hover:border-[#E4E9DD] dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-[#16211D] motion-reduce:transition-none";

// --- Small pieces ---

const CartBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A24B4B] px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-[#F3F5EE] dark:ring-[#16211D]">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

const Logo = () => (
  <Link
    href="/"
    aria-label="Ink of Memories, go to home page"
    className={cn("flex shrink-0items-center rounded-md", focusRing)}
  >
    <Image
      src="/inkofmemories.png"
      alt="Ink of Memories"
      className="h-24 w-auto object-contain lg:h-24 dark:hidden"
      width={180}
      height={60}
      priority
    />
    <Image
      src="/inkofmemories-dark.png"
      alt="Ink of Memories"
      className="hidden h-24 w-auto object-contain lg:h-24 dark:block"
      width={180}
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
        "fixed inset-x-0 top-0 z-50 border-b border-[#1F3A32]/15 bg-[#E4E9DD] backdrop-blur-xl transition-shadow duration-300 dark:border-[#E4E9DD]/15 dark:bg-[#16211D]/95 motion-reduce:transition-none",
        scrolled && "shadow-[0_12px_28px_-20px_rgba(31,58,50,.55)]",
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

          <div className="flex items-center gap-1.5 sm:gap-3">
            <ToggleButton />

            {mounted ? (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "relative rounded-full text-[#1F3A32] hover:bg-[#1F3A32]/10 hover:text-[#1F3A32] dark:text-[#E4E9DD] dark:hover:bg-white/10 dark:hover:text-white",
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
                className="h-10 w-10 animate-pulse rounded-full bg-[#1F3A32]/10 dark:bg-white/10"
              />
            )}

            {/* Account actions (desktop only; mobile has them in the panel) */}
            <div className="hidden items-center gap-3 lg:flex">
              <div
                aria-hidden="true"
                className="h-6 w-px bg-[#1F3A32]/20 dark:bg-[#E4E9DD]/20"
              />
              {!mounted ? (
                <div
                  aria-hidden="true"
                  className="h-9 w-20 animate-pulse rounded-full bg-[#1F3A32]/10 dark:bg-white/10"
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
                  <Button asChild size="sm" className={cn(primaryBtn, "px-5")}>
                    <Link href="/products">Order now</Link>
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
                "rounded-full p-2 text-[#1F3A32] transition-colors hover:bg-[#1F3A32]/10 dark:text-[#E4E9DD] dark:hover:bg-white/10 lg:hidden",
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
      <div className="hidden border-t border-[#1F3A32]/10 dark:border-[#E4E9DD]/10 lg:block">
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
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#B08D4A] xl:inset-x-4" />
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
                      className="mt-0.5 h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180 motion-reduce:transition-none"
                    />
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-0.5 origin-center bg-[#B08D4A] transition-transform duration-200 motion-reduce:transition-none xl:inset-x-4",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100",
                      )}
                    />
                  </Link>

                  {/* Dropdown: opens on hover and on keyboard focus */}
                  <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
                    <div className="relative mt-px min-w-[240px] rounded-b-sm border border-t-0 border-[#1F3A32]/15 bg-[#F7F4EE] py-2 shadow-[0_24px_40px_-20px_rgba(31,58,50,.5)] dark:border-[#E4E9DD]/15 dark:bg-[#1C2B26]">
                      {link.subItems.map((sub) => {
                        const subActive = active && activeSub === slugify(sub);
                        return (
                          <Link
                            key={sub}
                            href={subCategoryHref(link.slug, sub)}
                            aria-current={subActive ? "page" : undefined}
                            className={cn(
                              "block px-5 py-2.5 text-sm transition-colors hover:bg-[#1F3A32]/5 hover:text-[#1F3A32] focus-visible:bg-[#1F3A32]/5 focus-visible:text-[#1F3A32] focus-visible:outline-none dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:bg-white/5 dark:focus-visible:text-white",
                              subActive
                                ? "font-medium text-[#1F3A32] shadow-[inset_2px_0_0_#B08D4A] dark:text-white"
                                : "text-[#1F3A32]/75 dark:text-[#E4E9DD]/75",
                            )}
                          >
                            {sub}
                          </Link>
                        );
                      })}
                      <div className="mx-5 my-1.5 h-px bg-[#1F3A32]/15 dark:bg-[#E4E9DD]/15" />
                      <Link
                        href={categoryHref(link.slug)}
                        className="block px-5 py-2 text-xs font-medium text-[#1F3A32] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none dark:text-[#D2AE62]"
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
          "absolute inset-x-0 top-full h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-contain bg-[#F3F5EE] transition-all duration-300 ease-out dark:bg-[#16211D] motion-reduce:transition-none lg:hidden",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto max-w-xl px-5 pb-10 pt-4">
          <ul className="flex flex-col">
            <li className="border-y border-[#1F3A32]/10 dark:border-[#E4E9DD]/10">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={cn(
                  "block py-4 font-serif text-xl transition-colors",
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
                  className="border-b border-[#1F3A32]/10 dark:border-[#E4E9DD]/10"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={categoryHref(link.slug)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex-1 py-4 font-serif text-xl transition-colors",
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
                        "-mr-2 rounded-full p-2.5 text-[#1F3A32]/60 transition-colors hover:text-[#1F3A32] dark:text-[#E4E9DD]/60 dark:hover:text-white",
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
                                  className="h-1 w-1 rounded-full bg-[#B08D4A]"
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
              <div className="h-12 w-full animate-pulse rounded-full bg-[#1F3A32]/10 dark:bg-white/10" />
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
    className="fixed inset-x-0 top-0 z-50 border-b border-[#1F3A32]/15 bg-[#F3F5EE]/95 dark:border-[#E4E9DD]/15 dark:bg-[#16211D]/95"
  >
    <div className="mx-auto flex h-12 max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
      <Logo />
    </div>
    <div className="hidden h-10 border-t border-[#1F3A32]/10 dark:border-[#E4E9DD]/10 lg:block" />
  </nav>
);

export const Navbar = () => (
  <Suspense fallback={<NavbarFallback />}>
    <NavbarInner />
  </Suspense>
);
