"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Search, Gift, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ToggleButton from "../ToggleButton";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useSelector } from "react-redux";
import ProfileMenu from "../ProfileMenu";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
// Mock data for dropdowns
const navigationData = [
  {
    name: "Wedding Cards",
    path: "/products?category=wedding-cards",
    subItems: [
      "Premium Gold Foil",
      "Floral Suite",
      "Traditional Mandap",
      "Minimalist White",
    ],
  },
  {
    name: "Invitation Cards",
    path: "/products?category=invitation-cards",
    subItems: [
      "Birthday Invitations",
      "Anniversary Cards",
      "Corporate Events",
      "Festive Greetings",
    ],
  },
  {
    name: "Visiting Cards",
    path: "/products?category=visiting-cards",
    subItems: ["Matte Finish", "Spot UV", "Luxury Velvet", "Eco-friendly Card"],
  },
  {
    name: "Shagun Cards",
    path: "/products?category=shagun-cards",
    subItems: [
      "Traditional Designs",
      "Modern Minimal",
      "Gold Foiled",
      "Custom Printed",
    ],
  },
  {
    name: "Letter Pads",
    path: "/products?category=letter-pads",
    subItems: [
      "Corporate Letterheads",
      "Personal Stationery",
      "Notepads",
      "Envelopes",
    ],
  },
  {
    name: "Brochures & Catalogs",
    path: "/products?category=brochures",
    subItems: [
      "Product Catalogs",
      "Company Brochures",
      "Flyers & Leaflets",
      "Menu Cards",
    ],
  },
];

export const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "-translate-y-7" : "translate-y-0",
        )}
      >
        {/* 1. ANNOUNCEMENT BAR */}
        <div className="w-full bg-red-900 dark:bg-red-950 py-1.5 text-center">
          <p className="text-[10px] tracking-[0.3em] font-bold text-stone-100 uppercase">
            Flat 25% off on Wedding Stationery — Code{" "}
            <span className="text-stone-400 dark:text-stone-300">WED25</span>
          </p>
        </div>

        {/* 2. MAIN LOGO BAR */}
        <div className="w-full bg-white dark:bg-[#0f111a] border-b border-stone-100 dark:border-stone-800">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex flex-col items-center">
              <span className="font-serif text-2xl tracking-[0.15em] text-red-800 dark:text-red-500">
                Ink of Memories
              </span>
              {/* <span className="text-[9px] tracking-[0.5em] text-stone-400 dark:text-stone-500 uppercase -mt-1 font-bold">
                Printing
              </span> */}
            </Link>

            <div className="flex items-center gap-8">
              <div className="flex items-center">
                <ToggleButton />
              </div>

              <Link href="/cart" className="relative">
                <ShoppingBag className="h-5 w-5 text-red-400 dark:text-red-500 hover:text-red-900 dark:hover:text-red-400 stroke-[1.5]" />
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-900 dark:bg-red-800 text-white text-[8px] flex items-center justify-center font-bold">
                  0
                </span>
              </Link>

              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/auth")}
                  className="border-red-200 dark:border-red-900 text-red-900 dark:text-red-400 hover:bg-red-800 dark:hover:bg-red-900 dark:hover:text-white rounded-none text-[10px] tracking-widest uppercase px-6 font-bold"
                >
                  Login
                </Button>
              ) : (
                user && <ProfileMenu user={user} />
              )}
            </div>
          </div>
        </div>

        {/* 3. CATEGORY BAR WITH DROPDOWNS */}
        <nav className="hidden md:block bg-white dark:bg-[#0f111a] border-b border-stone-100 dark:border-stone-800 relative">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
            <div className="flex items-center gap-10 h-full">
              {navigationData.map((item) => (
                <div
                  key={item.name}
                  className="h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.path}
                    className={cn(
                      "text-[10px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-1",
                      pathname.includes(item.path)
                        ? "text-stone-900 dark:text-stone-100"
                        : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100",
                    )}
                  >
                    {item.name}
                    {item.subItems && (
                      <ChevronDown className="h-3 w-3 text-stone-300 dark:text-stone-600" />
                    )}
                  </Link>

                  {/* DROPDOWN MENU */}
                  {item.subItems && activeDropdown === item.name && (
                    <div className="absolute top-10 left-auto bg-white dark:bg-[#0d1321] border border-stone-100 dark:border-stone-800 shadow-xl py-4 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200 z-[70]">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub}
                          href="#"
                          className="block px-6 py-2.5 text-[10px] tracking-widest text-stone-500 dark:text-stone-400 uppercase font-medium hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
              <Link
                href="/gift-finder"
                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-stone-900 dark:text-stone-100 uppercase"
              >
                <Gift className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                Gift Finder
              </Link>
            </div>
          </div>
        </nav>
      </header>
      {/* Spacer div to prevent content overlap - matches total navbar height */}
      <div className="h-16" />
    </>
  );
};
