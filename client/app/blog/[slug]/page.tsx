import { fetchBlogBySlugServer } from "@/services/blogApi";
import BlogDetailClient from "./BlogDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlugServer(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description:
      post.excerpt?.substring(0, 160) ||
      "Read our latest article on printing and design from Ink of Memories.",
    openGraph: {
      title: post.title,
      description: post.excerpt?.substring(0, 160),
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image || "https://inkofmemories.com/inkofmemories.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt?.substring(0, 160),
      images: [post.image || "https://inkofmemories.com/inkofmemories.png"],
    },
    keywords: `${post.tags?.join(", ") || post.category}, printing tips, design trends`,
    alternates: {
      canonical: `https://inkofmemories.com/blog/${slug}`,
    },
    other: {
      "article:published_time": post.date,
      "article:author": post.author,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogBySlugServer(slug);

  if (!post) {
    notFound();
  }

  // Attach Article JSON-LD structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt?.substring(0, 200) || post.title,
    image: post.image || "https://inkofmemories.com/inkofmemories.png",
    author: {
      "@type": "Person",
      name: post.author || "Ink of Memories",
    },
    datePublished: post.date || post.createdAt,
    dateModified: post.updatedAt || post.date || post.createdAt,
    publisher: {
      "@type": "Organization",
      name: "Samlason Printing Press",
      logo: {
        "@type": "ImageObject",
        url: "https://inkofmemories.com/inkofmemories.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://inkofmemories.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogDetailClient post={post} slug={slug} />
    </>
  );
}
