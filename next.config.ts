import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos live in public/images and are served resized as WebP by the Next.js image optimizer.
    // WebP only: AVIF is slightly smaller but much slower to encode, so first views waited on blank cards.
    formats: ["image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
