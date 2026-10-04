import { noIndexMetadata } from "@/lib/seo";

/*
  /auth is the login/sign-up surface. It must never be indexed, and the page's
  own <SEOHelper> title flips between "Sign In" and "Create an Account" based on
  client state, so it can only ever be a post-hydration concern. This server
  layout supplies a stable noindex plus a neutral title/description that crawlers
  and password managers see up front.
*/
export const metadata = noIndexMetadata(
  "Sign In or Create an Account",
  "/auth",
  "Sign in to Ink of Memories to review digital proofs, re-order your bespoke stationery and manage printing projects.",
);

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}