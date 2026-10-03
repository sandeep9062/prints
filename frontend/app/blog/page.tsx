import { fetchBlogsServer } from "@/services/blogApi";
import JournalClient from "@/components/journal/JournalClient";

/**
 * ISR revalidation period (in seconds).
 * Next.js will re-generate this page every 1 hour on demand,
 * ensuring search engines always see fresh content.
 */
export const revalidate = 3600;

/**
 * Static Site Generation (SSG) for /blog.
 *
 * The server fetches all blogs at BUILD TIME (SSG) and renders them
 * into the static HTML sent to every visitor, then revalidates (ISR)
 * so the content stays fresh.
 *
 * The client wrapper receives the pre-fetched data and:
 *   - Shows it immediately (no loading spinner for the initial view).
 *   - Filters / searches fully client-side (backend has no pagination).
 */
export default async function BlogPage() {
  const blogs = await fetchBlogsServer();
  const categories = Array.from(
    new Set(blogs.map((b) => b.category).filter(Boolean) as string[]),
  );

  // Map BlogPost -> JournalPost shape expected by JournalClient
  // (blog.image -> coverImage, blog.date -> publishedAt).
  const initialJournals = blogs.map((b) => ({
    _id: b._id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    category: b.category,
    readTime: b.readTime,
    publishedAt: b.date,
    coverImage: b.image,
  }));

  return (
    <JournalClient
      initialJournals={initialJournals}
      initialCategories={categories}
    />
  );
}
