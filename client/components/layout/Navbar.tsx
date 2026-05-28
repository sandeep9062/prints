"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import ProfileMenu from "../ProfileMenu";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import ToggleButton from "../ToggleButton";
import Image from "next/image";
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Customize", path: "/customize" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about-us" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // List of base routes where the Navbar should be hidden
  const dashboardRoutes = [
    "/admin-dashboard",
    "/merchant-dashboard",
    "/my-account",
    "/auth",
  ];

  // Check if current path starts with any of the dashboard prefixes
  const isDashboard = dashboardRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isDashboard) return null;
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700 shadow-sm"
          : "bg-transparent dark:bg-[#0f111a]/90",
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex mt-2 flex-col leading-none">
              <Image
                src="/inkofmemories.png"
                alt="Ink of Memories"
                className="dark:hidden object-contain"
                width={140}
                height={140}
              />
              <Image
                src="/inkofmemories-dark.png"
                alt="Ink of Memories"
                className="hidden dark:block object-contain"
                width={140}
                height={140}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-300 group",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {link.name}

                  {/* Underline animation */}
                  <span
                    className={cn(
                      "absolute left-0 -bottom-1 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-full",
                      active && "w-full",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <ToggleButton />

            {mounted ? (
              <>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:text-primary"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link href="/products">
                  <Button
                    size="sm"
                    className="bg-foreground dark:bg-red-800 dark:text-white text-white shadow dark:hover:bg-red-900 "
                  >
                    Order Now
                  </Button>
                </Link>

                {!isAuthenticated ? (
                  <Button
                    size="sm"
                    onClick={() => router.push("/auth")}
                    className="bg-gradient-to-tr from-green-600 to-green-700 text-white shadow hover:from-green-700 hover:to-green-600"
                  >
                    Login
                  </Button>
                ) : (
                  user && <ProfileMenu user={user} />
                )}
              </>
            ) : (
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-9 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-9 bg-gray-200 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 transition-all",
                    pathname === link.path
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-border/40 pt-4" />

              {/* Mobile Actions */}
              {!mounted ? (
                <div className="w-full h-9 bg-gray-200 rounded-full animate-pulse" />
              ) : !isAuthenticated ? (
                <button
                  onClick={() => router.push("/auth")}
                  className="px-5 py-2 rounded-full text-white font-medium 
             bg-primary hover:bg-primary/90 
             transition-all shadow-md 
             focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  Login
                </button>
              ) : (
                <ProfileMenu user={user} mobile />
              )}

              <div className="flex items-center gap-4">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full relative"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Cart ({totalItems})
                  </Button>
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-foreground  text-white"
                  >
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
