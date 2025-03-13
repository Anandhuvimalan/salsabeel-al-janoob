import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // WARNING: This will allow production builds with type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // WARNING: This will ignore ESLint errors during production builds.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "hrrfjlbkbjmzkyihcufw.supabase.co"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hrrfjlbkbjmzkyihcufw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Matches all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Change to your domain if needed
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS, PUT, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
