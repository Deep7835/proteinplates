import placeholders from "./placeholders.json";

/** Blurred preview for a photo in public/ (made by `npm run images`), or undefined if there isn't one yet. */
export function blurFor(src: string): string | undefined {
  return (placeholders as Record<string, string>)[src];
}
