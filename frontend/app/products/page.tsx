import { ProductsListServer } from "./_components/ProductsListServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
    `absolute` because this title already ends with the brand — the root layout's
    `title.template` would otherwise append "| Ink of Memories" a second time.
    Kept near 60 characters so Google does not truncate it mid-phrase.
  */
  title: { absolute: "Shop Printing Products – Wedding & Visiting Cards" },
  description:
    "Browse our premium collection of printing products. Wedding invitation cards, visiting cards, brochures, banners, packaging & custom designs. Shop with Ink of Memories.",
  keywords: [
    "buy printing products",
    "wedding cards online",
    "visiting cards India",
    "brochure printing",
    "custom printing shop",
    "Ink of Memories",
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
      "Browse our premium collection of printing products from Ink of Memories.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
  alternates: {
    canonical: "https://inkofmemories.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsListServer />;
}
