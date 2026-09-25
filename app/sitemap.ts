import type { MetadataRoute } from "next";
import { itemPagesFor } from "@/lib/chains/items";
import { getAllChains } from "@/lib/chains/load";
import { latestCheckDate } from "@/lib/chains/rank";
import { audiences, footerLinks, site } from "@/lib/config/site";
import { getAllGuides } from "@/lib/guides/load";
import { getCalculatorPages } from "@/lib/calculators/pages";

// Every public page. lastModified comes from the data: data_checked_date for chains,
// the newest chain check for chain listings, and site.staticPagesUpdated for fixed pages.

export default function sitemap(): MetadataRoute.Sitemap {
  const chains = getAllChains();
  const url = (path: string) => `${site.url}${path}`;
  const guides = getAllGuides();
  const chainsUpdated = latestCheckDate(chains) ?? site.staticPagesUpdated;
  const guidesUpdated = guides.reduce<string>((max, g) => (g.updated > max ? g.updated : max), site.staticPagesUpdated);

  return [
    { url: url("/"), lastModified: site.staticPagesUpdated, priority: 1 },
    { url: url("/calculators"), lastModified: site.staticPagesUpdated, priority: 0.9 },
    ...getCalculatorPages().map((p) => ({
      url: url(p.variant ? `/${p.slug}/${p.variant}` : `/${p.slug}`),
      lastModified: p.updated,
      priority: p.variant ? 0.7 : 0.9,
    })),
    { url: url("/chains"), lastModified: chainsUpdated, priority: 0.9 },
    { url: url("/chains/top-protein-fast-food"), lastModified: chainsUpdated, priority: 0.8 },
    { url: url("/chains/glp1-friendly"), lastModified: chainsUpdated, priority: 0.8 },
    ...chains.map((c) => ({ url: url(`/chains/${c.slug}`), lastModified: c.data_checked_date, priority: 0.8 })),
    ...chains.flatMap((c) =>
      itemPagesFor(c).map((p) => ({
        url: url(`/chains/${c.slug}/${p.slug}`),
        lastModified: p.item.source?.checked ?? c.data_checked_date,
        priority: 0.6,
      })),
    ),
    { url: url("/guides"), lastModified: guidesUpdated, priority: 0.8 },
    ...guides.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: g.updated, priority: 0.7 })),
    ...footerLinks.map((l) => ({ url: url(l.href), lastModified: site.staticPagesUpdated, priority: 0.3 })),
    { url: url("/meal-plan"), lastModified: site.staticPagesUpdated, priority: 0.5 },
    { url: url("/terms"), lastModified: site.staticPagesUpdated, priority: 0.3 },
    ...audiences.map((a) => ({ url: url(`/for/${a.slug}`), lastModified: chainsUpdated > guidesUpdated ? chainsUpdated : guidesUpdated, priority: 0.8 })),
  ];
}
