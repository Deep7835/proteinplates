"use client";

import { IMAGE_WIDTHS, variantPath } from "./variants";

// next/image loader for the static export: points at the pre-resized WebP copies made by `npm run images`.
// Photos outside /images/ (none today) are returned unchanged.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/images/")) return src;
  const w = IMAGE_WIDTHS.find((x) => x >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return variantPath(src, w);
}
