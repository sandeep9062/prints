import { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalDetailClient from "./JournalDetailClient";
import {
  fetchBlogBySlugServer,
  fetchBlogsServer,
} from "@/services/blogApi";
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * ISR revalidation period (in seconds). Matches the /blog archive page so
 * both surfaces refresh together.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const journal = await fetchBlogBySlugServer(slug);

  if (!journal) {
    return {
      title: "Article Not Found | Ink of Memories Blog",
      description: "The article you're looking for could not be found.",
    };
  }

  const title = `${journal.title} | Ink of Memories Blog`;
  const description =
    journal.excerpt?.substring(0, 160) ||
    journal.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${journal.title} on Ink of Memories Blog.`;
  const canonicalUrl = `https://inkofmemories.com/blog/${slug}`;
  const imageUrl = journal.image || "https://inkofmemories.com/inkofmemories.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: journal.createdAt,
      authors: [journal.author || "Ink of Memories"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: journal.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;

  // The article and the list used for "related notes" are fetched together so
  // the page ships real content in its HTML — the client then keeps it fresh
  // via RTK Query. Without this the reader gets a skeleton on every load and
  // crawlers see an empty <article>.
  const [journal, allBlogs] = await Promise.all([
    fetchBlogBySlugServer(slug),
    fetchBlogsServer(),
  ]);

  if (!journal) {
    notFound();
  }

  const canonicalUrl = `https://inkofmemories.com/blog/${slug}`;

  // Generate all schemas — map BlogPost fields to the schema helpers
  // (blog.image -> coverImage).
  const schemaJournal = {
    ...journal,
    coverImage: journal.image,
    publishedAt: journal.date || journal.createdAt,
  };
  const articleSchema = generateArticleSchema(schemaJournal, slug);
  const faqSchema = generateFAQSchema(journal.content, journal.category);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://inkofmemories.com" },
    { name: "Blog", item: "https://inkofmemories.com/blog" },
    { name: journal.title, item: canonicalUrl },
  ]);

  return (
    <>
      {renderSchemaScript("article-jsonld", articleSchema)}
      {renderSchemaScript("faq-jsonld", faqSchema)}
      {renderSchemaScript("breadcrumb-jsonld", breadcrumbSchema)}
      <JournalDetailClient
        slug={slug}
        canonicalUrl={canonicalUrl}
        initialJournal={journal}
        initialBlogs={allBlogs}
      />
    </>
  );
}
