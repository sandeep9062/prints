import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import { Providers } from "./providers";
import RouteTransitionWrapper from "@/components/RouteTransitionWrapper";
import SmoothScroll from "@/components/SmoothScroll";
import CompareDrawer from "@/components/CompareDrawer";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND_NAME, FOUNDED_YEAR, LEGAL_NAME } from "@/lib/site-config";

/* Typography — two families, loaded through next/font so they are self-hosted
   and preloaded (no external <link>, no FOUT):
     --font-cormorant → Cormorant Garamond: headings only, 500/600, >= 28px.
     --font-dm-sans    → DM Sans: everything else (body, nav, buttons, forms).
   The variables land on <html> so :root-scoped rules (e.g. the sonner toaster)
   can read them too. */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} | Premium Printing & Design Services`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    `Premium printing services by ${LEGAL_NAME} since ${FOUNDED_YEAR}. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts in Panchkula, Chandigarh.`,
  keywords: [
    "printing press",
    "wedding cards",
    "invitation cards",
    "visiting cards",
    "business cards",
    "brochure printing",
    "banner printing",
    "packaging printing",
    "custom printing",
    "gold foil printing",
    "Panchkula printing",
    "Chandigarh printing",
    "Ink of Memories",
    "premium printing India",
  ],
  authors: [{ name: LEGAL_NAME }],
  creator: BRAND_NAME,
  publisher: LEGAL_NAME,
  metadataBase: new URL("https://inkofmemories.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | Premium Printing & Design Services`,
    description:
      `Premium printing services by ${LEGAL_NAME} since ${FOUNDED_YEAR}. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts.`,
    url: "https://inkofmemories.com",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} - Premium Printing`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Premium Printing`,
    description:
      `Premium printing services by ${LEGAL_NAME} since ${FOUNDED_YEAR}. Wedding cards, visiting cards, brochures & more.`,
    images: ["https://inkofmemories.com/inkofmemories.png"],
    creator: "@inkofmemories",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://inkofmemories.com",
    languages: {
      "en-IN": "https://inkofmemories.com",
      "x-default": "https://inkofmemories.com",
    },
  },
  /*
    `verification` intentionally omitted: it was still holding the literal
    placeholder "YOUR_GOOGLE_VERIFICATION_CODE", which Next.js would have
    rendered into the page as a real (and invalid) verification meta tag.
    Add your own Search Console code here once you have one.
  */
  category: "printing",
};

// Ink blue brand colour, so the browser UI (address bar, notch) matches the
// page. Exported via `viewport` (Next 14+); `metadata.themeColor` is deprecated.
export const viewport: Viewport = {
  themeColor: "#2D47BE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Panchkula" />
        {/*
          Restore the colour scheme BEFORE first paint. Tailwind v4 keys its
          `dark:` variant off a `.dark` class on <html> (see globals.css), but
          that class was only ever set inside ToggleButton's useEffect — which
          runs after hydration. Without this script every reload painted light
          first (FOUC) and pages without the toggle stayed light permanently.
          This mirrors Mantine's own ColorSchemeScript approach.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark");}else if(t==="light"){document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <SmoothScroll>
            <RouteTransitionWrapper>
              <CartProvider>
                <Navbar />

                {children}
                <Footer />
              </CartProvider>
            </RouteTransitionWrapper>
          </SmoothScroll>
          {/* Fixed-position compare tray — outside SmoothScroll/RouteTransitionWrapper
              so it isn't affected by scroll transforms or route exits. */}
          <CompareDrawer />
          {/* --toast-duration feeds the CSS countdown rail in globals.css; keep it
              in sync with the `duration` below so the bar matches the dismiss. */}
          <Toaster
            position="top-right"
            closeButton
            style={
              { "--toast-duration": "4000ms" } as React.CSSProperties
            }
            toastOptions={{ duration: 4000 }}
          />
        </Providers>
      </body>
    </html>
  );
}
