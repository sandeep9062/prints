import { noIndexMetadata } from "@/lib/seo";

/*
  /compare renders a comparison of whatever the visitor has queued in client
  state, so there is no stable content for a crawler to index — each request can
  produce a different (usually empty) table. noindex.
*/
export const metadata = noIndexMetadata(
  "Compare Printing Products",
  "/compare",
  "Compare printing products side by side — pricing, category and details — before you order from Ink of Memories.",
);

export default function CompareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}