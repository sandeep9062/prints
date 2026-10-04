import { noIndexMetadata } from "@/lib/seo";

/*
  /favourites is user-specific (the saved list only exists for a signed-in
  shopper) and empty for everyone else, so it is noindex. The page's own
  <SEOHelper noIndex> only took effect after hydration; this server layout makes
  the directive visible to crawlers that do not execute JavaScript.
*/
export const metadata = noIndexMetadata(
  "Favourites",
  "/favourites",
  "Your saved printing pieces — wedding cards, visiting cards, brochures and more, kept together so you can return to them any time.",
);

export default function FavouritesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}