import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Note: 'eslint' and 'typescript.ignoreBuildErrors' are being removed/deprecated
  // in Next 16 as Next.js moves toward externalizing these tools.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;