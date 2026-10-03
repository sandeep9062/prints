import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Printing Services - Ink of Memories | Wedding Cards, Visiting Cards, Brochures & More",
  description:
    "Explore premium printing from Ink of Memories — wedding cards, invitation cards, visiting cards, shagun envelopes, letter pads, brochures, banners, packaging, stickers and rubber stamps. Customised in-house in Panchkula.",
  openGraph: {
    title:
      "Printing Services - Ink of Memories | Hand-Pressed Stationery",
    description:
      "Wedding cards, visiting cards, shagun envelopes, brochures, banners and custom packaging — all printed in-house at our Panchkula atelier.",
    url: "https://inkofmemories.com/other-services",
    siteName: "Ink of Memories",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Printing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Printing Services - Ink of Memories | Hand-Pressed Stationery",
    description:
      "Wedding cards, visiting cards, brochures, banners & custom packaging — printed in-house in Panchkula.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://inkofmemories.com/other-services",
  },
};

// Other Services Page Structured Data Component
function OtherServicesStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ServicePage",
    name: "Printing Services - Ink of Memories",
    description:
      "Premium printing from Ink of Memories — wedding cards, visiting cards, shagun envelopes, letter pads, brochures, banners, packaging, stickers and rubber stamps.",
    url: "https://inkofmemories.com/other-services",
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
          name: "Printing Services",
          item: "https://inkofmemories.com/other-services",
        },
      ],
    },
  };

  return (
    <script
      id="other-services-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function OtherServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OtherServicesStructuredData />
      {children}
    </>
  );
}
