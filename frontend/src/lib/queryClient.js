import { QueryClient } from "@tanstack/react-query";

// Shared React Query client. Sensible defaults for a hotel-ops workload:
// - staleTime 30s: prevents chatty re-fetches on tab focus
// - retry 1: fail fast, we'll show skeletons rather than spin forever
// - refetchOnWindowFocus false: night audit runs shouldn't accidentally poll
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
