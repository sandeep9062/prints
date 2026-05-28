"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ChevronRight,
  Tag,
  ArrowRight,
} from "lucide-react";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import type { BlogPost } from "@/services/blogApi";

interface BlogDetailClientProps {
  post: BlogPost;
  slug: string;
}

export default function BlogDetailClient({
  post,
  slug,
}: BlogDetailClientProps) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href="/blog"
                className="hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {post.title}
              </span>
            </div>
          </div>
        </section>

        {post && (
          <>
            <SEOHelper
              title={post.title}
              description={
                post.excerpt?.substring(0, 160) ||
                "Read our latest article on printing and design from Ink of Memories."
              }
              path={`/blog/${slug}`}
              image={
                post.image || "https://inkofmemories.com/inkofmemories.png"
              }
              keywords={`${post.tags?.join(", ") || post.category}, printing tips, design trends`}
              type="article"
              publishedTime={post.date}
              author={post.author}
              jsonLd={breadcrumbSchema}
            />
            {/* Article Header */}
            <section className="py-12">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-4">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {post.category}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {post.author}{" "}
                      <span className="text-muted-foreground/70">
                        ({post.authorRole})
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </section>

            {/* Featured Image */}
            <section className="pb-12">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="rounded-2xl overflow-hidden aspect-[21/9]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Article Content */}
            <section className="pb-16">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                  {post.content.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-2xl md:text-3xl mt-10 mb-4">
                          {line.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3 key={i} className="text-xl md:text-2xl mt-8 mb-3">
                          {line.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p
                          key={i}
                          className="font-semibold text-foreground mt-4 mb-1"
                        >
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li
                          key={i}
                          className="text-muted-foreground ml-6 list-disc"
                        >
                          {line.replace("- ", "")}
                        </li>
                      );
                    }
                    if (line.startsWith("1. ")) {
                      return (
                        <li
                          key={i}
                          className="text-muted-foreground ml-6 list-decimal"
                        >
                          {line.replace(/^\d+\.\s*/, "")}
                        </li>
                      );
                    }
                    if (line.trim() === "") {
                      return <div key={i} className="h-4" />;
                    }
                    return (
                      <p
                        key={i}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author Bio */}
                <div className="mt-12 p-8 rounded-2xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold">
                        {post.author}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {post.authorRole}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.author} is a passionate member of the Ink of
                        Memories team, dedicated to helping customers create
                        beautiful printed materials that tell their unique
                        stories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Back to Blog */}
            <section className="pb-8">
              <div className="container mx-auto px-4 max-w-7xl">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
