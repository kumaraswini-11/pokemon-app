"use client";

import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "./get-query-client";

type ProviderProps = {
  children: React.ReactNode;
};

// React Query is a client-side tool because it manages state within the browser. We need to ensure its provider is a client-side component, which is why we're creating it outside of the RootLayout file.
export default function Providers({ children }: ProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )} */}
    </QueryClientProvider>
  );
}

/**
 * IMPORTANT: Special Next.js React Query Implementation
 *
 * In Next.js, the provider component typically goes inside the RootLayout, which
 * behind the scenes wraps components inside a Suspense boundary. This creates a problem:
 *
 * When anything is loading, components inside Suspense boundaries get suspended (unmounted),
 * causing us to lose the instance of the QueryClient when the component remounts.
 *
 * To solve this problem, we:
 * 1. Create the Providers component as a separate client component
 * 2. Store the QueryClient instance in a variable (browserQueryClient) that exists
 *    outside of React's render cycle
 * 3. This maintains the reference to the QueryClient even if the component is
 *    temporarily unmounted by Suspense
 *
 * The getQueryClient function ensures we always have a consistent reference
 * to the QueryClient on the client side, preserving the cache and state.
 */

/**
 * Next.js Data Fetching and State Management Strategy
 *
 * In Next.js, we can fetch data directly in server components before rendering the component.
 * This means technically, we don't always need React Query. However, there are certain features,
 * like infinite scrolling, optimistic updates, and client-side caching, that only work on the
 * client side, for which React Query is still valuable.
 *
 * React Query is used for synchronized, server-side data fetching. Essentially, it acts as a
 * data layer between the server and the client, storing the data so that we don't need to make
 * repeated requests to the server. This improves performance significantly, as data is cached
 * and revalidated efficiently.
 *
 * Zustand is a client-side state management library. While React Query handles server state,
 * Zustand is used for managing application/client state. App state includes things like a
 * multi-step form across multiple pages or a shopping cart that needs to be accessed from
 * anywhere in the app. In short, a state manager like Zustand is similar to useState, but
 * much more powerful, as it allows you to update state from anywhere in your app.
 *
 * Server state, on the other hand, refers to data fetched from an external API, such as a
 * list of posts or the number of likes on a post. For this kind of data, React Query is a
 * better choice because it handles caching, race conditions, automatic revalidation, and
 * is generally easier to use.
 *
 * Almost every app fetches data from a server, but only a few require global state management.
 * So, before building your app, ask yourself whether you need React Query or a state manager
 * like Zustand.
 */
