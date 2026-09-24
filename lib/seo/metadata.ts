import type { Metadata } from "next";
import { site } from "@/lib/config/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path starting with "/", used for the canonical URL and og:url. */
  path: string;
  type?: "website" | "article";
  /** Share image path. Defaults to the site-wide /opengraph-image. */
  image?: string;
  noindex?: boolean;
};

/** One place to build page metadata so every page gets a canonical URL and matching OG tags. */
export function buildMetadata({ title, description, path, type = "website", image = "/opengraph-image", noindex }: BuildMetadataInput): Metadata {
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
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
