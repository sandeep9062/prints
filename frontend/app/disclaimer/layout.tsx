import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Disclaimer | Ink of Memories" },
  description:
    "Read the legal disclaimer for Ink of Memories. Understand the limitations of liability, accuracy of information, colour reproduction and third-party content on our printing platform.",
  alternates: {
    canonical: "https://inkofmemories.com/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Ink of Memories",
    description: "Legal disclaimer for Ink of Memories' printing platform.",
    url: "https://inkofmemories.com/disclaimer",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Disclaimer",
      },
    ],
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
