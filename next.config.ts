import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["raw.githubusercontent.com"],
  },

  experimental: {
    // staleTimes is an experimental feature that enables caching of page segments in the client-side router cache. For more deatil: https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache
    // staleTimes: { dynamic: 30 }, // 30 seconds
  },

  // If a dependency is using Node.js specific features, you can choose to opt-out specific dependencies from the Server Components bundling and use native Node.js require.
  serverExternalPackages: ["@node-rs/argon2"],

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
