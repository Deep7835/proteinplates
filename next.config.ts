import type { NextConfig } from "next";

// Security headers for every response. Vercel already redirects http → https; HSTS tells browsers to
// always use https from then on (2 years). No "preload": that's hard to undo, so opt in later on purpose.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Don't allow other sites to show our pages in a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Photos live in public/images and are served resized as WebP by the Next.js image optimizer.
    // WebP only: AVIF is slightly smaller but much slower to encode, so first views waited on blank cards.
    formats: ["image/webp"],
    qualities: [75],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
