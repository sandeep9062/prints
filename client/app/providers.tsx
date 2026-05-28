"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <StoreProvider>{children}</StoreProvider>
    </MantineProvider>
  );
}
