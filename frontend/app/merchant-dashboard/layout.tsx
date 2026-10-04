import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";
import RoleGuard from "@/components/RoleGuard";
import MerchantDashboardShell from "./MerchantDashboardShell";

/*
  Server layout for the merchant dashboard.

  The dashboard UI is a client component (sidebar + pathname-driven nav), so it
  lives in MerchantDashboardShell.tsx. Metadata lives here so `noindex` is part
  of the SSR HTML rather than being injected after hydration — every
  /merchant-dashboard/* route was previously indexable.
*/
export const metadata: Metadata = {
  ...noIndexMetadata(
    "Merchant Dashboard",
    "/merchant-dashboard",
    "Merchant storefront management for sellers on Ink of Memories.",
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

export default function MerchantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
      UX-only role check — the API is the real security boundary. The merchant
      routes it calls are guarded server-side with `protect` +
      `authorize("merchant","admin")` + `isOwnerOrAdmin`, so skipping this
      component gains an attacker nothing. It exists so a signed-out visitor is
      sent to /auth and a plain customer is returned to the storefront.
    */
    <RoleGuard allow={["merchant", "admin"]}>
      <MerchantDashboardShell>{children}</MerchantDashboardShell>
    </RoleGuard>
  );
}