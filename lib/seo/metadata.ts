import type { Metadata } from "next";
import { site } from "@/lib/config/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path starting with "/", used for the canonical URL and og:url. */
  path: string;
  type?: "website" | "article";
  /** Share image path. Defaults to the site-wide /og.png (1200×630). */
  image?: string;
  /** Pixel size of `image`, when it isn't 1200×630 (e.g. guide cover photos are 1600×900). */
  imageSize?: { width: number; height: number };
  noindex?: boolean;
};

/** One place to build page metadata so every page gets a canonical URL and matching OG tags. */
export function buildMetadata({ title, description, path, type = "website", image = "/og.png", imageSize = { width: 1200, height: 630 }, noindex }: BuildMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type,
      // Page metadata replaces the root openGraph object, so the share image is always set here.
      images: [{ url: image, ...imageSize, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
