import { noIndexMetadata } from "@/lib/seo";

/*
  /profile is the public-facing author/creator profile surface. It is
  per-account content with no marketing value in search results and was fully
  indexable; keep it out of the index.
*/
export const metadata = noIndexMetadata(
  "Profile",
  "/profile",
  "View and update your Ink of Memories profile — manage your name, email, phone number and profile photo.",
);

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}