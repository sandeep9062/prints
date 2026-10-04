import { noIndexMetadata } from "@/lib/seo";

/*
  /cart is a per-visitor surface that is empty for every new session, so it must
  never be indexed — an indexed empty cart is a textbook "soft 404" and dilutes
  the site's quality signal. Previously it also advertised a canonical pointing
  at the homepage (inherited from the root layout), which compounded the problem.

  The page component is a client component, so the metadata lives here in this
  server layout.
*/
export const metadata = noIndexMetadata(
  "Shopping Cart",
  "/cart",
  "Review your printing order — wedding cards, visiting cards, brochures, banners and custom printed packaging from Ink of Memories.",
);

export default function CartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}