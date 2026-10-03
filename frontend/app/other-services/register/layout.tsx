import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Your Print | Ink of Memories",
  description:
    "Start a custom printing enquiry with Ink of Memories. Share your wedding card, visiting card, shagun envelope or brochure requirements and get a design consultation.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://inkofmemories.com/other-services/register",
  },
};

export default function PrintEnquiryRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}