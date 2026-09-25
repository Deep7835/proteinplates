import type { CSSProperties } from "react";
import placeholders from "./placeholders.json";

/** Tiny preview for a photo in public/ (made by `npm run images`), or undefined if there isn't one yet. */
export function blurFor(src: string): string | undefined {
  return (placeholders as Record<string, string>)[src];
}

/**
 * Background style for an image's wrapper: the tiny preview, scaled up by the browser (which makes it soft),
 * shows until the real photo paints over it. Cheaper than next/image's placeholder="blur", which draws each
 * preview through an SVG blur filter and slowed down pages with many cards.
 */
export function placeholderStyle(dataUrl: string | undefined): CSSProperties | undefined {
  return dataUrl ? { backgroundImage: `url("${dataUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined;
}
