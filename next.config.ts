import type { NextConfig } from "next";
import { IMAGE_WIDTHS } from "./lib/images/variants";

// Static export: `npm run build` writes plain HTML, CSS, JS, and images to out/, which any static host
// (Cloudflare Workers/Pages, Vercel, Netlify) can serve with no server code.
// Security headers live in public/_headers (Cloudflare and Netlify read that file).
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No on-the-fly optimizer in a static export: photos are pre-resized at build time (npm run images).
    loader: "custom",
    loaderFile: "./lib/images/loader.ts",
    imageSizes: [IMAGE_WIDTHS[0]],
    deviceSizes: IMAGE_WIDTHS.slice(1),
  },
};

export default nextConfig;
