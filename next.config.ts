import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Ensure translation files are served correctly
  async rewrites() {
    return [
      {
        source: '/locales/:locale/:namespace.json',
        destination: '/api/locales/:locale/:namespace',
      },
    ];
  },
};

export default nextConfig;
