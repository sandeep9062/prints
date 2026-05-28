import { ProductsListServer } from "./_components/ProductsListServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Printing Products – Wedding Cards, Visiting Cards & More",
  description:
    "Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs. Shop with Samlason Printing Press.",
  keywords: [
    "buy printing products",
    "wedding cards online",
    "visiting cards India",
    "brochure printing",
    "custom printing shop",
    "Samlason Printing",
  ],
  openGraph: {
    title: "Shop Printing Products – Wedding Cards, Visiting Cards & More",
    description:
      "Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs.",
    type: "website",
    locale: "en_IN",
    siteName: "Ink of Memories",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Printing Products – Wedding Cards, Visiting Cards & More",
    description:
      "Browse our premium collection of printing products from Samlason Printing Press.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
  alternates: {
    canonical: "https://inkofmemories.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsListServer />;
}
