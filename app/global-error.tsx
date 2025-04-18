"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  // error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

/**
 * This GlobalError component handles errors that bubble up to the root of the application
 * and are not caught by specific `error.tsx` files within route segments.
 *
 * It is important to remember that this file overrides the layout.tsx, meaning it must
 * contain the <html> and <body> tags.
 *
 * In the development environment, when an error occurs, instead of the interface from
 * the global-error.tsx, an error overlay appears on the screen (unless the development
 * overlay is disabled or fails). This overlay provides detailed error information, which
 * helps developers debug and resolve issues quickly. In production, Next.js shows a
 * user-friendly error page and avoids exposing sensitive error details.
 */
