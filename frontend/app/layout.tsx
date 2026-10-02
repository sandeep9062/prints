import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import { Providers } from "./providers";
import RouteTransitionWrapper from "@/components/RouteTransitionWrapper";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Ink of Memories | Premium Printing & Design Services by Samlason Printing Press",
    template: "%s | Ink of Memories",
  },
  description:
    "Premium printing services by Samlason Printing Press since 2004. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts in Panchkula, Chandigarh.",
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
    "Samlason Printing",
    "Ink of Memories",
    "premium printing India",
  ],
  authors: [{ name: "Samlason Printing Press" }],
  creator: "Ink of Memories",
  publisher: "Samlason Printing Press",
  metadataBase: new URL("https://inkofmemories.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Ink of Memories",
    title: "Ink of Memories | Premium Printing & Design Services",
    description:
      "Premium printing services by Samlason Printing Press since 2004. Wedding cards, visiting cards, brochures, banners, packaging & personalized gifts.",
    url: "https://inkofmemories.com",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories - Premium Printing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ink of Memories | Premium Printing",
    description:
      "Premium printing services by Samlason Printing Press since 2004. Wedding cards, visiting cards, brochures & more.",
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
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add your Google Search Console verification code here
  },
  category: "printing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Panchkula" />
        <meta name="theme-color" content="#991b1b" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <RouteTransitionWrapper>
            <CartProvider>
              <Navbar />

              {children}
              <Footer />
            </CartProvider>
          </RouteTransitionWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
