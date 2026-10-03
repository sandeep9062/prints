/**
 * Schema Markup (JSON-LD) Utilities for Ink of Memories
 * Server-side only implementation with safety checks
 */

import React from "react";

// Check if we're running on server (safety check)
export const isServer = typeof window === "undefined";

/**
 * Generate Printing Service / Product Schema
 * (for stationery suites, wedding cards, visiting cards, brochures...)
 */
export function generatePrintingProductSchema(product: any, id: string) {
  if (!isServer) return null;

  const imageUrls = Array.isArray(product?.image)
    ? product.image.filter(
        (img: string) =>
          !img.toLowerCase().endsWith(".mp4") &&
          !img.toLowerCase().endsWith(".webm") &&
          !img.toLowerCase().endsWith(".ogg"),
      )
    : product?.image
      ? [product.image]
      : [];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sanitizeText(product?.title || ""),
    description: sanitizeText(product?.description || ""),
    category: sanitizeText(product?.category || "Stationery"),
    brand: {
      "@type": "Brand",
      name: "Ink of Memories",
    },
    offers: {
      "@type": "Offer",
      price: product?.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    image: imageUrls,
    url: `https://inkofmemories.com/products/${id}`,
    provider: {
      "@type": "Organization",
      name: "Ink of Memories",
      url: "https://inkofmemories.com",
    },
  };
}

/**
 * Generate Article Schema for Press Notes / Blog posts
 */
export function generateArticleSchema(journal: any, slug: string) {
  if (!isServer) return null;

  const canonicalUrl = `https://inkofmemories.com/blog/${slug}`;
  const imageUrl =
    journal.coverImage ||
    journal.image ||
    "https://inkofmemories.com/inkofmemories.png";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: journal.title,
    description: sanitizeText(
      stripHtml(journal.excerpt || journal.content)?.substring(0, 250) ||
        journal.title,
    ),
    image: imageUrl,
    datePublished: journal.publishedAt || journal.date || journal.createdAt,
    dateModified: journal.updatedAt || journal.createdAt || journal.date,
    author: {
      "@type": "Person",
      name: journal.author || "Samlason Printing Press",
    },
    publisher: {
      "@type": "Organization",
      name: "Ink of Memories",
      logo: {
        "@type": "ImageObject",
        url: "https://inkofmemories.com/inkofmemories.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    wordCount:
      stripHtml(journal.content || "").split(/\s+/).filter(Boolean).length || 0,
  };
}

/**
 * Generate FAQPage Schema
 * Auto extracts FAQs from content or uses printing-specific fallback questions
 */
export function generateFAQSchema(content: string, category?: string) {
  if (!isServer) return null;

  const faqs: Array<{ question: string; answer: string }> = [];

  // Auto extract FAQ items from content if they exist
  const extractedFaqs = extractFAQsFromContent(content);
  faqs.push(...extractedFaqs);

  // Add printing-specific fallback questions (matches homepage services)
  if (category) {
    faqs.push(
      {
        question: `What paper options are available for ${category}?`,
        answer: `For ${category} we offer premium matte, textured linen, pearl shimmer and cotton stocks in 250-350 GSM. Every order is proofed on real paper at our Panchkula atelier before final printing.`,
      },
      {
        question: `What is the ordering timeline for ${category}?`,
        answer: `We recommend ordering ${category} at least 2-3 weeks in advance (3-4 months for weddings). Digital printing is available for quick turnarounds and offset / letterpress for large or luxury runs.`,
      },
      {
        question: `Can I customise the design and finish?`,
        answer: `Yes — every suite is designed with you. Choose foil stamping (gold, rose gold, copper), letterpress deboss, embossing and envelope liners. Start from the Customize page or book a consultation.`,
      },
    );
  }

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; item: string }>,
) {
  if (!isServer) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

/**
 * Helper: Strip HTML tags from text
 */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ");
}

/**
 * Helper: Sanitize text for schema
 */
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Helper: Extract FAQ items from content looking for common patterns
 */
function extractFAQsFromContent(
  content: string,
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  if (!content) return faqs;

  // Look for Q: / A: patterns or FAQ sections
  const faqRegex =
    /(?:Q:|Question:|FAQ:)\s*(.*?)(?:\n|$)(?:A:|Answer:)\s*(.*?)(?=\n\n|\nQ:|\nQuestion:|$)/gis;
  let match;

  while ((match = faqRegex.exec(content)) !== null) {
    if (match[1] && match[2]) {
      faqs.push({
        question: stripHtml(match[1]).trim(),
        answer: stripHtml(match[2]).trim(),
      });
    }
  }

  return faqs;
}

/**
 * Render Schema Script Tag safely
 */
export function renderSchemaScript(id: string, schema: any) {
  if (!schema || !isServer) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
