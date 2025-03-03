import { QueryClient, isServer } from "@tanstack/react-query";

// Creates a new instance of QueryClient with default configuration.
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // prevents unnecessary refetches, which is good for performance.
        retry: 1,
      },
    },
  });
}

// Store the client instance for the browser environment
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // If we are on the server we always return a new instance of query clinet.
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
