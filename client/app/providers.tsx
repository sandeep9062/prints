"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <StoreProvider>
        {children}
        <Toaster />
      </StoreProvider>
    </MantineProvider>
  );
}
