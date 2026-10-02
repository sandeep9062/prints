import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

const BASE_URL = SITE_CONFIG.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/business`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/customize`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/my-account`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
  ];

  // Try to fetch products for dynamic product sitemap entries
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products?limit=100`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    const data = await res.json();
    const products = data?.products || [];
    productPages = products.map((product: any) => ({
      url: `${BASE_URL}/products/${product.slug || product._id}`,
      lastModified: new Date(
        product.updatedAt || product.createdAt || Date.now(),
      ),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    // If API is unavailable, skip dynamic product entries
    console.warn("Could not fetch products for sitemap");
  }

  // Try to fetch blog posts for dynamic blog sitemap entries
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/blogs`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    const data = await res.json();
    const blogs = data?.blogs || data || [];
    blogPages = blogs.map((blog: any) => ({
      url: `${BASE_URL}/blog/${blog.slug || blog._id}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If API is unavailable, skip dynamic blog entries
    console.warn("Could not fetch blogs for sitemap");
  }

  return [...staticPages, ...productPages, ...blogPages];
}
