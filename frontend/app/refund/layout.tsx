import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Ink of Memories",
  description:
    "Learn about Ink of Memories' refund policy, reprint and cancellation terms, and conditions for custom printing orders. Understand reprint windows and refund timelines.",
  alternates: {
    canonical: "https://inkofmemories.com/refund",
  },
  openGraph: {
    title: "Refund Policy | Ink of Memories",
    description:
      "Learn about Ink of Memories' refund policy and reprint terms for custom printing orders.",
    url: "https://inkofmemories.com/refund",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Ink of Memories Refund Policy",
      },
    ],
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
