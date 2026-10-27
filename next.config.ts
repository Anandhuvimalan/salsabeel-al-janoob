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
    formats: ["image/avif", "image/webp"],
    // Optimized images are keyed by URL and uploads always get new file names, so cache for a long time
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tnaxeecfbmgcxgnlclji.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@tabler/icons-react", "react-icons"],
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
