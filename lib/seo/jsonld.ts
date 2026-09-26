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
    logo: absoluteUrl("/logo.png"),
    email: site.contactEmail,
  };
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
      ? { "@type": "Person", name: input.author }
      : { "@type": "Organization", name: site.name, url: site.url },
    ...(input.reviewedBy ? { reviewedBy: { "@type": "Person", name: input.reviewedBy } } : {}),
    publisher: { "@id": `${site.url}/#organization` },
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
