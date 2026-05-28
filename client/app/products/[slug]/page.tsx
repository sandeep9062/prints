import { fetchProductBySlugServer } from "@/services/productsApi";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlugServer(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description?.substring(0, 160) ||
      `Buy ${product.name} online from Samlason Printing Press. Premium quality printing at the best price.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      type: "website",
      locale: "en_IN",
      siteName: "Ink of Memories",
      images: [
        {
          url:
            product.images?.[0] ||
            "https://inkofmemories.com/inkofmemories.png",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [
        product.images?.[0] || "https://inkofmemories.com/inkofmemories.png",
      ],
    },
    keywords: `${product.name}, ${product.category}, buy ${product.name} online, printing ${product.category}`,
    alternates: {
      canonical: `https://inkofmemories.com/products/${slug}`,
    },
    other: {
      "product:price:amount": String(product.discountPrice || product.price),
      "product:price:currency": "INR",
      "product:availability": "in stock",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlugServer(slug);

  if (!product) {
    notFound();
  }

  // Attach product JSON-LD structured data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.substring(0, 200),
    image: product.images?.[0] || "https://inkofmemories.com/inkofmemories.png",
    url: `https://inkofmemories.com/products/${slug}`,
    ...(product.category && { category: product.category }),
    brand: {
      "@type": "Brand",
      name: "Samlason Printing Press",
    },
    offers: {
      "@type": "Offer",
      price: product.discountPrice || product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://inkofmemories.com/products/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} slug={slug} />
    </>
  );
}
