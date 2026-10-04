import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";
import { getRootSeoSlugs } from "@/lib/seoListings";

const BASE_URL = SITE_CONFIG.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages.
  //
  // NOTE: /cart, /auth and /my-account were listed here but are `noindex`
  // (they are per-visitor, empty-by-default surfaces). Advertising them in the
  // sitemap while asking Google not to index them is a contradictory signal,
  // and /cart in particular is the classic "soft 404" that drags down a
  // site's quality rating. Only genuinely indexable, content-bearing pages
  // belong here.
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
      url: `${BASE_URL}/other-services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
      url: `${BASE_URL}/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  /*
    Programmatic root SEO pages (/{category}-printing-in-{city} and
    ...-printing-near-{locality}). These are 140 of the site's highest-intent
    landing pages — city + service combinations — and they were entirely absent
    from the sitemap, so Google had no cheap way to discover or re-crawl them.
    The list is derived from the same taxonomy that feeds generateStaticParams
    (lib/seoListings.ts), so it can never drift from the routes that exist.
  */
  const rootSeoPages: MetadataRoute.Sitemap = getRootSeoSlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

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

  return [...staticPages, ...rootSeoPages, ...productPages, ...blogPages];
}
