"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

export function QueryClientProviderNext(props: { children: React.ReactNode }) {
  const client = useRef(new QueryClient());
  return (
    <QueryClientProvider client={client.current}>
      {props.children}
    </QueryClientProvider>
  );
}
