import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ink of Memories",
  description:
    "Read the privacy policy of Ink of Memories. We are committed to protecting your personal information and being transparent about how we handle your order and account data.",
  openGraph: {
    title: "Privacy Policy | Ink of Memories",
    description:
      "Learn about how we protect your data and respect your privacy at Ink of Memories.",
    url: "https://inkofmemories.com/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://inkofmemories.com/inkofmemories.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ink of Memories",
    description:
      "Our commitment to your privacy. Read our policy to understand how we handle your data.",
    images: ["https://inkofmemories.com/inkofmemories.png"],
  },
  alternates: {
    canonical: "https://inkofmemories.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
