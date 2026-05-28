import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Ink of Memories",
  description:
    "The page you're looking for doesn't exist. Browse our premium printing products or contact us for help.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 - Page Not Found | Ink of Memories",
    description:
      "The page you're looking for doesn't exist. Browse our premium printing products or contact us for help.",
    url: "https://inkofmemories.com/404",
    isPartOf: {
      "@type": "WebSite",
      name: "Ink of Memories",
      url: "https://inkofmemories.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Contact our support team:
            </p>
            <div className="space-y-2">
              <Button asChild variant="link" size="sm">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="link" size="sm">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
