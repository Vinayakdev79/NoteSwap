import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Serve uploaded files as static assets
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-upload?path=:path*',
      },
    ];
  },
};

export default nextConfig;
