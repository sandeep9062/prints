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
    <footer className="bg-foreground text-background/90">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="block">
              {/* Light Mode Logo - Visible by default, hidden in dark mode */}
              <Image
                src="/inkofmemories-dark.png"
                alt={websiteName}
                width={180}
                height={60}
                className="dark:hidden object-contain"
                priority
              />
              {/* Dark Mode Logo - Hidden by default, visible in dark mode */}
              <Image
                src="/inkofmemories.png"
                alt={websiteName}
                width={180}
                height={60}
                className="hidden dark:block object-contain"
                priority
              />
            </Link>

            <p className="text-sm text-white/80 dark:text-black leading-relaxed mb-5">
              Crafting legacies with elegant print. A digital atelier powered by
              <span className="text-white/80 dark:text-black font-medium">
                {" "}
                Samlason Printing Press
              </span>
              , bringing over 27 years of artisanal excellence to your doorstep.
            </p>

            <div className="flex gap-4">
              {socialPlatforms.map(({ icon: Icon, key }) => {
                const url = socialUrls[key];
                if (!url) return null;
                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 dark:text-red-800 dark:hover:text-red-600 hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-background mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
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
                    className="text-sm text-background/70  dark:hover:text-red-800 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-lg font-semibold text-background mb-4">
              Our Products
            </h4>
            <ul className="space-y-3">
              {navigationData.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-sm text-background/70 dark:hover:text-red-800  hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-background mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary dark:text-red-800 shrink-0 mt-0.5" />
                <span className="text-sm text-background/70">{mainOffice}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary dark:text-red-800 shrink-0" />
                <span className="text-sm text-background/70     ">
                  {contactNo1}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary dark:text-red-800 shrink-0" />
                <span className="text-sm text-background/70">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © 2024 {websiteName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-background/50 hover:text-background/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-background/50 hover:text-background/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
