import { BlogListServer } from "./_components/BlogListServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Printing Blog – Tips, Trends & Inspiration | Ink of Memories",
  description:
    "Explore our printing blog for expert tips on wedding invitations, business cards, packaging design, and the latest printing trends. Insights from Samlason Printing Press.",
  keywords: [
    "printing blog",
    "wedding invitation tips",
    "design trends",
    "printing guide",
    "Samlason Printing",
    "Ink of Memories",
  ],
  openGraph: {
    title: "Printing Blog – Tips, Trends & Inspiration | Ink of Memories",
    description:
      "Explore our printing blog for expert tips on wedding invitations, business cards, packaging design, and the latest printing trends.",
    type: "website",
    locale: "en_IN",
    siteName: "Ink of Memories",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Printing Blog – Tips, Trends & Inspiration | Ink of Memories",
    description:
      "Expert printing tips, wedding invitation ideas, and design trends from Samlason Printing Press.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
  alternates: {
    canonical: "https://inkofmemories.com/blog",
  },
};

export default function BlogPage() {
  return <BlogListServer />;
}
