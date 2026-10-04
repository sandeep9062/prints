"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import type { RootState } from "@/store/store";

/*
 * Client-side role gate for the dashboard areas.
 *
 * IMPORTANT: this is UX only — the API is the real security boundary. Every
 * guarded backend route independently enforces `protect` + `authorize` /
 * `checkAdmin`, so bypassing this component gains an attacker nothing. It exists
 * so a signed-in user with the wrong role gets a sensible redirect instead of a
 * half-rendered dashboard full of failed requests, and so a logged-out visitor
 * is sent to sign in.
 */

// The auth slice is rehydrated from localStorage on the client, so it is empty
// during SSR and on the first client render. `useSyncExternalStore` returns a
// stable `false` on the server and `true` after hydration — the standard way to
// detect "we're on the client now" without a setState-in-effect cascade.
const emptySubscribe = () => () => {};
const useIsHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

export default function RoleGuard({
  allow,
  children,
}: {
  /** Roles permitted to view this area. */
  allow: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // Hold the render until we know who the user is, so dashboard content (and
  // its data fetches) never flash for someone who is about to be redirected.
  const mounted = useIsHydrated();

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth");
      return;
    }

    if (!allow.includes(user.role)) {
      // Admins can use the merchant area; anyone else goes home.
      router.replace(user.role === "admin" ? "/admin-dashboard" : "/");
    }
  }, [mounted, isAuthenticated, user, allow, router]);

  if (!mounted) return <GuardFallback />;
  if (!isAuthenticated || !user) return <GuardFallback />;
  if (!allow.includes(user.role)) return <GuardFallback />;

  return <>{children}</>;
}

function GuardFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2
        aria-hidden="true"
        className="h-6 w-6 animate-spin text-brand"
      />
      <span className="sr-only">Checking access…</span>
    </div>
  );
}