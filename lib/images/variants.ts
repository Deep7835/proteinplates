// Widths we pre-generate for every photo (see scripts/image-placeholders.mts). next.config.ts uses the same
// list for imageSizes/deviceSizes, so every width next/image asks for exists as a file.
export const IMAGE_WIDTHS = [384, 640, 828, 1200, 1600] as const;

/** "/images/guides/kfc.jpg", 828 → "/images/w/guides/kfc-828.webp" */
export function variantPath(src: string, width: number): string {
  const rel = src.replace(/^\/images\//, "").replace(/\.[a-z0-9]+$/i, "");
  return `/images/w/${rel}-${width}.webp`;
}
