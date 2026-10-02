"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  LinkedinIcon,
  ArrowUp,
  Feather,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// --- Data ---

const productLinks = [
  { name: "Wedding Cards", path: "/products?category=wedding-cards" },
  { name: "Invitation Cards", path: "/products?category=invitation-cards" },
  { name: "Visiting Cards", path: "/products?category=visiting-cards" },
  { name: "Shagun Cards", path: "/products?category=shagun-cards" },
  { name: "Letter Pads", path: "/products?category=letter-pads" },
  { name: "Brochures & Catalogs", path: "/products?category=brochures" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Business", path: "/business" },
  { name: "Customize", path: "/customize" },
  { name: "About Us", path: "/about-us" },
  { name: "Contact", path: "/contact" },
  { name: "Blog", path: "/blog" },
];

const socialPlatforms = [
  { icon: Facebook, key: "facebook" as const, label: "Facebook" },
  { icon: Instagram, key: "instagram" as const, label: "Instagram" },
  { icon: Twitter, key: "twitter" as const, label: "Twitter" },
  { icon: LinkedinIcon, key: "linkedin" as const, label: "LinkedIn" },
];

const HIDDEN_ROUTES = ["/auth"];

// --- Shared styles ---

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground";

const footerLink = `group inline-flex items-center py-1 text-sm text-background/65 transition-colors hover:text-background dark:hover:text-red-800 rounded-sm ${focusRing}`;

// --- Small pieces ---

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-5 flex items-center gap-2.5 font-display text-base font-semibold text-background">
    <span
      aria-hidden="true"
      className="h-4 w-0.5 rounded-full bg-primary dark:bg-red-800"
    />
    {children}
  </h4>
);

const FooterLink = ({ href, children }: { href: string; children: string }) => (
  <Link href={href} className={footerLink}>
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </span>
  </Link>
);

const ContactRow = ({
  icon: Icon,
  href,
  external,
  children,
}: {
  icon: typeof Mail;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) => {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-background/15 bg-background/5 text-background/80 transition-colors group-hover/row:border-primary/60 group-hover/row:text-primary dark:text-red-800 dark:group-hover/row:border-red-800/60">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1.5 text-sm leading-relaxed text-background/70 transition-colors group-hover/row:text-background">
        {children}
      </span>
    </>
  );

  const base = "group/row flex items-start gap-3 rounded-md";

  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${base} ${focusRing}`}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      ) : (
        <div className={base}>{content}</div>
      )}
    </li>
  );
};

// --- Component ---

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

  const pathname = usePathname();

  if (HIDDEN_ROUTES.some((route) => pathname?.startsWith(route))) return null;

  const socialUrls: Record<string, string> = {
    facebook,
    instagram,
    twitter,
    linkedin,
  };

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mainOffice ?? "",
  )}`;

  return (
    <footer className="relative w-full overflow-hidden bg-foreground text-background/90">
      {/* Hairline that echoes the navbar */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to action */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-background/10 py-10 md:flex-row md:items-center lg:py-12">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-semibold leading-snug text-background sm:text-3xl">
              Have an occasion to print for?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-background/65 sm:text-base">
              Pick a design, or tell us what you have in mind and we will
              customise it for you.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-background px-6 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background/90 dark:bg-red-800 dark:text-white dark:hover:bg-red-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Link href="/products">
                <Feather className="mr-2 h-4 w-4" />
                Order now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-background/25 bg-transparent px-6 text-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          {/* Brand */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={`${websiteName}, go to home page`}
              className={`inline-block rounded-md ${focusRing} h-34`}
            >
              {/* Footer background is the inverse of the page theme, so the logos are swapped */}
              <Image
                src="/inkofmemories-dark.png"
                alt={websiteName}
                width={180}
                height={40}
                className="object-contain mb-0 dark:hidden"
                priority
              />
              <Image
                src="/inkofmemories.png"
                alt={websiteName}
                width={180}
                height={40}
                className="hidden object-contain mb-0 dark:block"
                priority
              />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-background/65">
              From premium wedding stationery to bespoke retail packaging, we
              bridge heritage craftsmanship with modern design.
            </p>

            <ul className="mt-6 flex items-center gap-2.5">
              {socialPlatforms.map(({ icon: Icon, key, label }) => {
                const url = socialUrls[key];
                if (!url) return null;
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${websiteName} on ${label}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-background/15 text-background/75 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white dark:text-red-800 dark:hover:border-red-800 dark:hover:bg-red-800 dark:hover:text-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <ColumnHeading>Quick links</ColumnHeading>
            <ul className="flex flex-col">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <FooterLink href={link.path}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products */}
          <nav aria-label="Our products" className="lg:col-span-3">
            <ColumnHeading>Our products</ColumnHeading>
            <ul className="flex flex-col">
              {productLinks.map((item) => (
                <li key={item.path}>
                  <FooterLink href={item.path}>{item.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColumnHeading>Contact us</ColumnHeading>
            <ul className="space-y-4">
              {mainOffice && (
                <ContactRow icon={MapPin} href={mapsHref} external>
                  {mainOffice}
                </ContactRow>
              )}
              {contactNo1 && (
                <ContactRow
                  icon={Phone}
                  href={`tel:${String(contactNo1).replace(/\s+/g, "")}`}
                >
                  {contactNo1}
                </ContactRow>
              )}
              {email && (
                <ContactRow icon={Mail} href={`mailto:${email}`}>
                  <span className="break-all">{email}</span>
                </ContactRow>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-background/10 py-6 sm:flex-row">
          <p className="order-2 text-xs text-background/50 sm:order-1">
            © {new Date().getFullYear()} {websiteName}. All rights reserved.
          </p>

          <div className="order-1 flex items-center gap-6 sm:order-2">
            <Link
              href="/privacy-policy"
              className={`rounded-sm text-xs text-background/50 transition-colors hover:text-background ${focusRing}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`rounded-sm text-xs text-background/50 transition-colors hover:text-background ${focusRing}`}
            >
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-background/15 text-background/70 transition-colors hover:border-primary hover:text-primary dark:hover:border-red-800 dark:hover:text-red-800 ${focusRing}`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
