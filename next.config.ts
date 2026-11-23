import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Les illustrations officielles sont hébergées sur GitHub par la PokéAPI.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
