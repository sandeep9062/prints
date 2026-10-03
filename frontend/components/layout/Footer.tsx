"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  LinkedinIcon,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSubscribeNewsletterMutation } from "@/services/newsletterApi";
import { scrollToTop } from "@/lib/smooth-scroll";

/*
  Design notes
  - The footer is always the deep green "desk" (#1A312A) in both themes, so it
    always uses the dark-background logo. (Before, it inverted with the theme.)
  - The call to action is a stationery card on the desk: bone paper, grain and
    a double gold rule, like the cards in the hero and testimonials.
*/

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

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

// --- Shared styles ---

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2AE62] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A312A] dark:focus-visible:ring-offset-[#0F1815]";

const footerLink = `inline-block rounded-sm py-1 text-sm text-[#E4E9DD]/75 underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-[#D2AE62] motion-reduce:transition-none ${focusRing}`;

// --- Small pieces ---

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-5 font-serif text-xl font-medium text-[#F7F4EE]">
    {children}
  </h2>
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E4E9DD]/25 text-[#D2AE62]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1.5 text-sm leading-relaxed text-[#E4E9DD]/80 transition-colors group-hover/row:text-white">
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

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribeToNewsletter, { isLoading: isSubscribing }] =
    useSubscribeNewsletterMutation();

  const handleNewsletterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const emailToSubscribe = newsletterEmail.trim();
    if (!emailToSubscribe) return;

    try {
      const response = await subscribeToNewsletter({
        email: emailToSubscribe,
      }).unwrap();
      toast.success(
        response?.alreadySubscribed
          ? "You're already on the list."
          : "Subscribed!",
        { description: response?.message },
      );
      setNewsletterEmail("");
    } catch (error) {
      const message =
        (error as { data?: { error?: string } })?.data?.error ??
        "Something went wrong. Please try again.";
      toast.error("Subscription failed", { description: message });
    }
  };

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
    <footer className="relative w-full overflow-hidden bg-[#1A312A] text-[#E4E9DD] dark:bg-[#0F1815]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[#B08D4A]/50"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to action: a stationery card on the desk */}
        <div className="relative my-12 rounded-sm bg-[#F7F4EE] px-8 py-10 text-[#1F3A32] shadow-[0_28px_60px_-28px_rgba(0,0,0,.7)] md:px-12 md:py-12 lg:my-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-sm opacity-[.2] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-[#B08D4A]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 border border-[#B08D4A] opacity-50"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h3 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
                Have an occasion to print for?
              </h3>
              <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-[#1F3A32]/75">
                Pick a design, or tell us what you have in mind and we will
                customise it for you.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#1F3A32] px-7 text-[#F7F4EE] transition-colors hover:bg-[#2B4F44] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Link href="/products">Order now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-[#1F3A32]/40 bg-transparent px-7 text-[#1F3A32] transition-colors hover:border-[#1F3A32] hover:bg-[#1F3A32]/5 hover:text-[#1F3A32] focus-visible:ring-2 focus-visible:ring-[#B08D4A] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pb-12 pt-4 sm:grid-cols-2 lg:grid-cols-12 lg:pb-16">
          {/* Brand */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={`${websiteName}, go to home page`}
              className={`mb-5 inline-block rounded-md ${focusRing}`}
            >
              <Image
                src="/inkofmemories-dark.png"
                alt={websiteName}
                width={180}
                height={40}
                className="h-auto w-44 object-contain"
                priority
              />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-[#E4E9DD]/75">
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
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E9DD]/25 text-[#E4E9DD] transition-colors hover:border-[#F7F4EE] hover:bg-[#F7F4EE] hover:text-[#1A312A] motion-reduce:transition-none ${focusRing}`}
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
                  <Link href={link.path} className={footerLink}>
                    {link.name}
                  </Link>
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
                  <Link href={item.path} className={footerLink}>
                    {item.name}
                  </Link>
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

        {/* Newsletter */}
        <div className="border-t border-[#E4E9DD]/15 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-xl font-medium text-[#F7F4EE]">
                Subscribe to our newsletter
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#E4E9DD]/75">
                Seasonal offers, new designs and printing inspiration —
                delivered to your inbox. No spam, unsubscribe anytime.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row lg:w-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                disabled={isSubscribing}
                placeholder="you@example.com"
                className="h-12 w-full flex-1 rounded-full border border-[#E4E9DD]/25 bg-transparent px-5 text-sm text-[#F7F4EE] outline-none transition-colors placeholder:text-[#E4E9DD]/40 focus:border-[#D2AE62] disabled:opacity-60 sm:w-64"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isSubscribing}
                className="h-12 shrink-0 rounded-full bg-[#D2AE62] px-7 text-[#1A312A] transition-colors hover:bg-[#E0C07C] disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#D2AE62] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A312A] motion-reduce:transition-none dark:focus-visible:ring-offset-[#0F1815]"
              >
                {isSubscribing ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E4E9DD]/15 py-6 sm:flex-row">
          <p className="order-2 text-xs text-[#E4E9DD]/60 sm:order-1">
            © {new Date().getFullYear()} {websiteName}. All rights reserved.
          </p>

          <div className="order-1 flex items-center gap-6 sm:order-2">
            <Link
              href="/privacy-policy"
              className={`rounded-sm text-xs text-[#E4E9DD]/60 transition-colors hover:text-white ${focusRing}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`rounded-sm text-xs text-[#E4E9DD]/60 transition-colors hover:text-white ${focusRing}`}
            >
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={() => scrollToTop()}
              aria-label="Back to top"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E9DD]/25 text-[#E4E9DD]/80 transition-colors hover:border-[#D2AE62] hover:text-[#D2AE62] motion-reduce:transition-none ${focusRing}`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
