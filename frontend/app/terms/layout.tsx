import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ink of Memories",
  description:
    "Read the Terms & Conditions for using Ink of Memories, the printing platform by Samlason Printing Press. Understand your rights and responsibilities when ordering wedding cards, visiting cards, brochures or custom stationery.",
  alternates: {
    canonical: "https://inkofmemories.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Ink of Memories",
    description:
      "Terms & Conditions for ordering custom printing and stationery on Ink of Memories.",
    url: "https://inkofmemories.com/terms",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Ink of Memories",
    description:
      "Terms & Conditions for ordering custom printing and stationery on Ink of Memories.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
