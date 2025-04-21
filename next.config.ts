import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon",
      },
    ],
  },

  experimental: {
    // staleTimes is an experimental feature that enables caching of page segments in the client-side router cache. For more deatil: https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache
    // staleTimes: { dynamic: 30 }, // 30 seconds
    // viewTransition: true,
  },

  // If a dependency is using Node.js specific features, you can choose to opt-out specific dependencies from the Server Components bundling and use native Node.js require.
  serverExternalPackages: ["bcryptjs"],

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
