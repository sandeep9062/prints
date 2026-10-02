"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LogoSpinner from "./LogoSpinner";

export default function RouteTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Only show loading when navigating TO home page FROM another page
    if (
      pathname === "/" &&
      previousPathname.current &&
      previousPathname.current !== "/"
    ) {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }

    // Update previous pathname
    previousPathname.current = pathname;
  }, [pathname]);

  if (loading) return <LogoSpinner />;

  return <>{children}</>;
}
