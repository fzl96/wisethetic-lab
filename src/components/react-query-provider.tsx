"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient();

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
