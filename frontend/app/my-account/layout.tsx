import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";
import UserAccountShell from "./UserAccountShell";

/*
  Server layout for the customer account area.

  The tabbed account UI is a client component (it owns the active-tab state),
  so it lives in UserAccountShell.tsx. Metadata lives here so the `noindex` on
  /my-account and all of its sub-routes (order history, address book, saved
  cards, rewards, …) is present in the SSR HTML. These pages contain a user's
  personal data and must never appear in search results.
*/
export const metadata: Metadata = {
  ...noIndexMetadata(
    "My Account",
    "/my-account",
    "Manage your Ink of Memories account — orders, saved designs, addresses and rewards.",
  ),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": -1,
    },
  },
};

export default function MyAccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <UserAccountShell>{children}</UserAccountShell>;
}