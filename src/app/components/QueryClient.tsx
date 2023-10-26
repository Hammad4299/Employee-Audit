"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

export function QueryClientProviderNext(props: { children: React.ReactNode }) {
  const client = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1 * 60 * 1000,
          staleTime: Infinity,
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    })
  );
  return (
    <QueryClientProvider client={client.current}>
      {props.children}
    </QueryClientProvider>
  );
}
