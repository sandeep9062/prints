import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogBySlugServer as getBlogBySlugServer } from "@/services/blogApi";
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";
import BlogDetailClient from "./BlogDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Ink of Memories",
      description: "The article you're looking for could not be found.",
    };
  }

  const canonicalUrl = `https://www.inkofmemories.com/blogs/${slug}`;
  const imageUrl =
    blog.image ||
    "https://images.unsplash.com/photo-1590066305974-26999a08ec40?q=80&w=1200";
  const description =
    blog.excerpt?.substring(0, 160) ||
    blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${blog.title} on Ink of Memories - expert printing insights.`;

  return {
    title: `${blog.title} | Ink of Memories`,
    description,
    keywords: blog.tags?.length > 0 ? blog.tags : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: blog.createdAt,
      authors: [blog.author || "Ink of Memories Editorial"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    notFound();
  }

  const canonicalUrl = `https://www.inkofmemories.com/blogs/${slug}`;
  const imageUrl =
    blog.image ||
    "https://images.unsplash.com/photo-1590066305974-26999a08ec40?q=80&w=1200";

  // Generate schemas
  const articleSchema = generateArticleSchema(blog, slug);
  const faqSchema = generateFAQSchema(blog.content);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://www.inkofmemories.com" },
    { name: "Blogs", item: "https://www.inkofmemories.com/blogs" },
    { name: blog.title, item: canonicalUrl },
  ]);

  return (
    <>
      {renderSchemaScript("article-jsonld", articleSchema)}
      {renderSchemaScript("faq-jsonld", faqSchema)}
      {renderSchemaScript("breadcrumb-jsonld", breadcrumbSchema)}
      <BlogDetailClient slug={slug} />
    </>
  );
}
