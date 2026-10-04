import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";
import RoleGuard from "@/components/RoleGuard";
import AdminDashboardShell from "./AdminDashboardShell";

/*
  Server layout for the admin area.

  The dashboard UI itself is a client component (it owns the sidebar collapse
  state), so it lives in AdminDashboardShell.tsx and cannot export metadata from
  here. Keeping metadata in a server layout means the `noindex` directive is
  present in the SSR HTML — previously every /admin-dashboard/* page was fully
  indexable, which risks exposing internal admin URLs in search results.

  `nofollow` is set as well: there is nothing here worth passing link equity to,
  and admin screens link out to many internal routes.
*/
export const metadata: Metadata = {
  ...noIndexMetadata(
    "Admin Dashboard",
    "/admin-dashboard",
    "Internal administration area for Ink of Memories.",
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

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
      UX-only role check. The API enforces admin authorization on every route
      this area calls (`protect` + `checkAdmin`), so this is purely to give a
      wrong-role visitor a clean redirect instead of a broken dashboard.
    */
    <RoleGuard allow={["admin"]}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </RoleGuard>
  );
}