"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const SpecEvolutionViewer = dynamic(
  () => import("@/components/spec-evolution/viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#020a05]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-teal-500 rounded-full animate-spin" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">
            Reanimating Neural Pathways...
          </span>
        </div>
      </div>
    ),
  }
);

export default function ViewerLoader() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SpecEvolutionViewer />
    </QueryClientProvider>
  );
}
