"use client";

import { useState } from "react";
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
  - The footer is always the midnight navy "desk" (bg-footer) in both themes, so
    it always uses the dark-background logo and the fixed light-on-navy text
    tokens (footer-foreground / footer-muted) rather than `foreground`.
  - The call to action is a stationery card on the desk: ivory paper, grain and
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

// Focus ring is the brand colour; the offset matches the navy desk so the ring
// stays visible in both themes.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-footer";

// -my-1 offsets the py-2 so each link reaches a comfortable tap height without
// changing the visual rhythm of the stacked link lists.
const footerLink = `inline-block -my-1 rounded-sm py-2 text-sm text-footer-muted underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-footer-foreground hover:decoration-gold motion-reduce:transition-none ${focusRing}`;

// --- Small pieces ---

/* Kept a step smaller than the desktop size: on phones this sits inside a
   two-column grid track, where 20px headings wrap mid-phrase. */
const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 text-base font-semibold text-footer-foreground sm:mb-5 sm:text-xl">
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-footer-foreground/25 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1.5 text-sm leading-relaxed text-footer-muted transition-colors group-hover/row:text-footer-foreground">
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
    <footer className="relative w-full overflow-hidden bg-footer">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gold/50"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to action: a stationery card on the desk */}
        <div className="relative my-10 rounded-sm bg-ivory px-6 py-8 text-foreground shadow-[0_28px_60px_-28px_rgba(0,0,0,.7)] sm:px-8 sm:py-10 md:px-12 md:py-12 lg:my-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-sm opacity-[.2] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />
          {/* The double gold rule is inset closer on phones: the card's padding
              scales down faster than a fixed inset would, so at 12px/16px the
              frame sat almost against the copy. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 border border-gold sm:inset-3"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-gold opacity-50 sm:inset-4"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h3 className="font-serif text-[1.75rem] font-medium leading-tight sm:text-3xl md:text-4xl">
                Have an occasion to print for?
              </h3>
              <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-foreground/75">
                Pick a design, or tell us what you have in mind and we will
                customise it for you.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:shrink-0">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-full bg-primary px-7 text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
              >
                <Link href="/products">Order now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-foreground/40 bg-transparent px-7 text-foreground transition-colors hover:border-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
              >
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Link grid
            Mobile keeps two tracks (brand + contact span the full width) so the
            footer doesn't become a single endless column. The old `sm:` 2-col
            step also stranded "Contact us" alone in a half-empty row, since
            nothing after it could fill the track. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-12 pt-4 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12 lg:pb-16">
          {/* Brand */}
          <div className="col-span-2 flex flex-col items-start lg:col-span-4">
            {/* Text wordmark, same wording as the Navbar and /auth. The footer
                sits on the midnight-navy --footer surface, so it uses the footer
                colour roles (light ink + gold accent), NOT the page-level
                text-foreground/text-primary — those measure 1.14:1 here. */}
            <Link
              href="/"
              aria-label={`${websiteName}, go to home page`}
              className={`-mt-2 mb-3 inline-block rounded-md py-2 font-sans text-lg font-semibold tracking-wider text-footer-foreground transition-colors hover:text-gold motion-reduce:transition-none ${focusRing}`}
            >
              INK <span className="text-gold">OF</span> MEMORIES
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-footer-muted">
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
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-footer-foreground/25 text-footer-foreground transition-colors hover:border-gold hover:text-gold motion-reduce:transition-none ${focusRing}`}
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
          <div className="col-span-2 lg:col-span-3">
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
                  {/* `anywhere` instead of `break-all`: it still stops long
                      addresses forcing a horizontal scrollbar on phones, but
                      leaves short addresses on one line. */}
                  <span className="[overflow-wrap:anywhere]">{email}</span>
                </ContactRow>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-footer-foreground/15 py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold text-footer-foreground">
                Subscribe to our newsletter
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-footer-muted">
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
                className="h-12 w-full rounded-full border border-footer-foreground/25 bg-transparent px-5 text-sm text-footer-foreground outline-none transition-colors placeholder:text-footer-muted/60 focus:border-gold disabled:opacity-60 sm:w-64 sm:flex-1"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isSubscribing}
                className="h-12 shrink-0 rounded-full bg-gold px-7 text-footer transition-colors hover:bg-gold disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-footer motion-reduce:transition-none"
              >
                {isSubscribing ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-footer-foreground/15 py-5 sm:flex-row sm:py-6">
          <p className="order-2 text-center text-xs text-footer-muted sm:order-1 sm:text-left">
            © {new Date().getFullYear()} {websiteName}. All rights reserved.
          </p>

          {/* Wraps below ~360px instead of pushing the bar into a horizontal
              scroll, and the tighter mobile gaps keep it on one line on most
              phones. */}
          <div className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:order-2 sm:gap-6">
            <Link
              href="/privacy-policy"
              className={`-my-2 rounded-sm py-2 text-xs text-footer-muted transition-colors hover:text-footer-foreground ${focusRing}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`-my-2 rounded-sm py-2 text-xs text-footer-muted transition-colors hover:text-footer-foreground ${focusRing}`}
            >
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={() => scrollToTop()}
              aria-label="Back to top"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-footer-foreground/25 text-footer-muted transition-colors hover:border-gold hover:text-gold motion-reduce:transition-none ${focusRing}`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
