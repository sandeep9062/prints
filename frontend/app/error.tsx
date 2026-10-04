"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * Next.js requires this to be a Client Component. It catches errors thrown while
 * rendering a route segment below it (but not errors in this file's own layout).
 *
 * IMPORTANT: the error's message and stack are deliberately NOT rendered. In
 * development Next.js prints them to the console automatically; surfacing them
 * in the UI would leak stack traces, file paths and internal query text to
 * anyone who triggers an error in production.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side details go to the logs, not to the visitor.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg border border-border bg-card px-8 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
        </span>

        <h1 className="mt-8 font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
          Something went <em className="font-medium text-brand">wrong</em>
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
          We couldn&apos;t load this page. It&apos;s a problem on our side, not
          yours — please try again, and if it keeps happening get in touch and
          we&apos;ll sort it out.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={reset}
            className="rounded-full bg-footer px-7 py-3 text-[13px] font-semibold text-footer transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full px-7 py-3 text-[13px] font-semibold"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>

        {/* `digest` is a safe, opaque reference id that support can use to
            find the matching server log entry. */}
        {error.digest && (
          <p className="mt-8 text-[11px] text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}