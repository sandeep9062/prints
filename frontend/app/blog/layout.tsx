import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Notes | Printing Guides, Paper & Design Inspiration",
  description:
    "Printing guides, paper notes and design inspiration from Ink of Memories — wedding cards, visiting cards, shagun envelopes, brochures & bespoke stationery. Read the Ink of Memories blog from Panchkula.",
  alternates: {
    canonical: "https://inkofmemories.com/blog",
  },
  openGraph: {
    title: "Press Notes | Printing Guides, Paper & Design Inspiration",
    description:
      "Wedding cards, visiting cards, paper stocks, foil & letterpress guides from the Ink of Memories atelier in Panchkula.",
    url: "https://inkofmemories.com/blog",
    siteName: "Ink of Memories",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories — Press Notes on printing & stationery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Notes | Ink of Memories Blog",
    description:
      "Wedding cards, visiting cards, paper stocks, foil & letterpress guides from Ink of Memories.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
};

// Structured Data for Blog Listing Page
function BlogStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ink of Memories — Press Notes",
    description:
      "Printing guides, paper notes and design inspiration for weddings, business & personal stationery.",
    url: "https://inkofmemories.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Ink of Memories",
      url: "https://inkofmemories.com",
      logo: {
        "@type": "ImageObject",
        url: "https://inkofmemories.com/inkofmemories.png",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://inkofmemories.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://inkofmemories.com/blog",
        },
      ],
    },
  };

  return (
    <script
      id="blog-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlogStructuredData />
      {children}
    </>
  );
}

