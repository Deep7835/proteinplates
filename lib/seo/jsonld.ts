import { site } from "@/lib/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";

// Plain builders for schema.org JSON-LD. Render with <JsonLd data={...} />.

type Thing = Record<string, unknown>;

export function organizationLd(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    email: site.contactEmail,
    founder: authorLd(site.author.name),
    publishingPrinciples: absoluteUrl("/editorial-policy"),
  };
}

/** Person markup; the site's own author also gets the About page as their profile. */
export function authorLd(name: string): Thing {
  return name === site.author.name
    ? { "@type": "Person", "@id": absoluteUrl(site.author.path), name, url: absoluteUrl(site.author.path) }
    : { "@type": "Person", name };
}

export function websiteLd(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export type Faq = { question: string; answer: string };

export function faqLd(faqs: Faq[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author?: string | null;
  reviewedBy?: string | null;
  image?: string;
}): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: input.author
      ? authorLd(input.author)
      : { "@type": "Organization", name: site.name, url: site.url },
    ...(input.reviewedBy ? { reviewedBy: { "@type": "Person", name: input.reviewedBy } } : {}),
    publisher: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name, url: site.url, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    ...(input.image ? { image: /^https?:\/\//.test(input.image) ? input.image : absoluteUrl(input.image) } : {}),
  };
}

export function webApplicationLd(input: { name: string; description: string; path: string }): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
