"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  LinkedinIcon,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePathname } from "next/dist/client/components/navigation";

// Mock data for dropdowns
const navigationData = [
  { name: "Wedding Cards", path: "/products?category=wedding-cards" },
  { name: "Invitation Cards", path: "/products?category=invitation-cards" },
  { name: "Visiting Cards", path: "/products?category=visiting-cards" },
  { name: "Shagun Cards", path: "/products?category=shagun-cards" },
  { name: "Letter Pads", path: "/products?category=letter-pads" },
  { name: "Brochures & Catalogs", path: "/products?category=brochures" },
];

const socialPlatforms = [
  { icon: Facebook, key: "facebook" as const },
  { icon: Instagram, key: "instagram" as const },
  { icon: Twitter, key: "twitter" as const },
  { icon: LinkedinIcon, key: "linkedin" as const },
];

export const Footer = () => {
  const {
    websiteName,
    email,
    mainOffice,
    contactNo1,
    facebook,
    instagram,
    twitter,
    linkedin,
  } = useSiteSettings();

  const socialUrls: Record<string, string> = {
    facebook,
    instagram,
    twitter,
    linkedin,
  };

  const dashboardRoutes = [
    // "/admin-dashboard",
    // "/merchant-dashboard",
    // "/user-dashboard",
    "/auth",
  ];
  const pathname = usePathname();
  const isDashboard = dashboardRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isDashboard) return null;

  return (
    <footer className="bg-foreground text-background/90 w-full border-t border-background/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 items-start">
          {/* Brand Column (Occupies 4 out of 12 columns on large screens) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-start space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              {/* Light Mode Logo */}
              <Image
                src="/inkofmemories-dark.png"
                alt={websiteName}
                width={180}
                height={30}
                className="dark:hidden object-contain"
                priority
              />
              {/* Dark Mode Logo */}
              <Image
                src="/inkofmemories.png"
                alt={websiteName}
                width={180}
                height={30}
                className="hidden dark:block object-contain"
                priority
              />
            </Link>

            <p className="text-sm text-white/70 dark:text-black/70 leading-relaxed max-w-sm mb-6">
              From premium wedding stationery to bespoke retail packaging, we
              bridge heritage craftsmanship with modern design.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {socialPlatforms.map(({ icon: Icon, key }) => {
                const url = socialUrls[key];
                if (!url) return null;
                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 dark:text-red-800 dark:hover:text-red-600 hover:text-primary transition-colors p-1.5 -m-1.5 rounded-full hover:bg-background/5 dark:hover:bg-foreground/5"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column (Occupies 2 out of 12 columns) */}
          <div className="lg:col-span-2 flex flex-col space-y-4 lg:items-start">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-background">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Business", path: "/business" },
                { name: "Customize", path: "/customize" },
                { name: "About Us", path: "/about-us" },
                { name: "Contact", path: "/contact" },
                { name: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-background/70 dark:hover:text-red-800 hover:text-white transition-colors block py-0.5 subtle-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column (Occupies 3 out of 12 columns to comfortably handle layout spacing) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-background">
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {navigationData.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-sm text-background/70 dark:hover:text-red-800 hover:text-white transition-colors block py-0.5 subtle-underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (Occupies 3 out of 12 columns to avoid ugly wrapping lines) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-background">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/70 dark:text-red-800 shrink-0 mt-0.5" />
                <span className="text-sm text-background/70 leading-relaxed">
                  {mainOffice}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/70 dark:text-red-800 shrink-0" />
                <span className="text-sm text-background/70">{contactNo1}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/70 dark:text-red-800 shrink-0" />
                <span className="text-sm text-background/70 break-all">
                  {email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs tracking-wide text-background/50 order-2 sm:order-1">
            © 2024 {websiteName}. All rights reserved.
          </p>
          <div className="flex gap-6 order-1 sm:order-2">
            <Link
              href="/privacy-policy"
              className="text-xs tracking-wide text-background/50 hover:text-background/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs tracking-wide text-background/50 hover:text-background/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
