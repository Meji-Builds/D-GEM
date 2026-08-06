import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, which real phone camera photos blow through
      // instantly. Images are compressed client-side before upload
      // (see src/lib/compressImage.ts), so this is just a safety net
      // kept under Vercel's own ~4.5MB serverless request body limit.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
