"use client";

import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Root error boundary — catches failures in the root layout itself, replacing
 * the whole page (including <html>/<body>).
 *
 * Because the root layout's providers and fonts are unavailable at this point,
 * this component deliberately uses inline styles and system fonts rather than
 * the Tailwind theme classes, which cannot be relied on here.
 *
 * As with app/error.tsx, no error detail is rendered to the visitor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#16204F",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <div
            aria-hidden="true"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              margin: "0 auto",
              borderRadius: "9999px",
              background: "rgba(200, 60, 60, 0.1)",
              color: "#B03A3A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1
            style={{
              marginTop: "1.75rem",
              fontSize: "1.75rem",
              lineHeight: 1.25,
              fontWeight: 600,
            }}
          >
            We couldn&apos;t load the site
          </h1>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9375rem",
              lineHeight: 1.75,
              color: "#5A6485",
            }}
          >
            Something went wrong on our end. Please try again — if it keeps
            happening, get in touch and we&apos;ll look into it.
          </p>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "none",
                cursor: "pointer",
                borderRadius: "9999px",
                background: "#0F1638",
                color: "#ffffff",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.75rem 1.75rem",
              }}
            >
              Try again
            </button>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                border: "2px solid #2D47BE",
                color: "#2D47BE",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.75rem 1.75rem",
                textDecoration: "none",
              }}
            >
              <Home size={16} aria-hidden="true" />
              Back to home
            </Link>
          </div>

          {error.digest && (
            <p style={{ marginTop: "2rem", fontSize: "0.6875rem", color: "#5A6485" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}