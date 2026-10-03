"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";
import { CompareProvider } from "../store/CompareProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <MantineProvider>
      <StoreProvider>
        {/* Compare tray wraps the whole app so a selection made on /products is
            still there on /favourites and on the /compare page itself. */}
        <CompareProvider>{children}</CompareProvider>
      </StoreProvider>
    </MantineProvider>
  );

  // GoogleOAuthProvider requires a non-empty clientId — skip it until the
  // env var is set, otherwise the whole app would crash on load.
  // The social buttons handle the missing-ID case with a fallback button.
  if (!GOOGLE_CLIENT_ID) return content;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {content}
    </GoogleOAuthProvider>
  );
}
