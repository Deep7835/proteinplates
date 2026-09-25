import { itemPagesFor } from "@/lib/chains/items";
import { getAllChains } from "@/lib/chains/load";
import { getCalculatorPages } from "@/lib/calculators/pages";
import { AUDIENCE_HUBS } from "@/lib/config/audiences";
import { audiences, footerLinks, site } from "@/lib/config/site";
import { getAllGuides } from "@/lib/guides/load";
import { COUNTRY_LABELS } from "@/lib/chains/format";

export type SearchDoc = {
  /** URL path */
  u: string;
  /** title */
  t: string;
  /** short description */
  d: string;
  /** type label shown in results */
  k: "Calculator" | "Guide" | "Chain" | "Menu item" | "Page";
  /** extra words to match (menu items, tags), not shown */
  x: string;
};

/** Everything searchable on the site, built at build time. */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const p of getCalculatorPages()) {
    docs.push({
      u: p.variant ? `/${p.slug}/${p.variant}` : `/${p.slug}`,
      t: p.title,
      d: p.intro,
      k: "Calculator",
      x: [p.primaryKeyword ?? "", ...p.faqs.map((f) => f.question)].join(" "),
    });
  }
  for (const g of getAllGuides()) {
    docs.push({ u: `/guides/${g.slug}`, t: g.title, d: g.description, k: "Guide", x: [g.primaryKeyword ?? "", ...g.tags].join(" ") });
  }
  for (const c of getAllChains()) {
    docs.push({
      u: `/chains/${c.slug}`,
      t: `${c.chain} high-protein menu`,
      d: `${c.country.map((x) => COUNTRY_LABELS[x]).join(", ")} · ${c.intro_notes}`.slice(0, 160),
      k: "Chain",
      x: [c.chain, c.category, c.glp1_menu_name ?? "", ...c.items.map((i) => i.name)].join(" "),
    });
    for (const p of itemPagesFor(c)) {
      docs.push({
        u: `/chains/${c.slug}/${p.slug}`,
        t: `${c.chain} ${p.item.name} calories`,
        d: `${p.item.calories} calories${p.item.protein_g !== null ? ` · ${p.item.protein_g} g protein` : ""}`,
        k: "Menu item",
        x: `${c.chain} ${p.item.category} calories protein nutrition`,
      });
    }
  }
  for (const a of audiences) {
    const hub = AUDIENCE_HUBS[a.slug];
    docs.push({ u: `/for/${a.slug}`, t: hub.title, d: hub.description, k: "Page", x: a.label });
  }
  const pages: [string, string, string][] = [
    ["/chains", "All restaurant chains", "High-protein orders at US, UK, and Indian chains."],
    ["/chains/top-protein-fast-food", "Top 25 highest-protein fast food items", "The highest-protein items across every chain we track."],
    ["/chains/glp1-friendly", "Chains with GLP-1 and high-protein menus", "Labeled high-protein and GLP-1 menus."],
    ["/calculators", "All calculators", "Protein, calorie, body, and nutrient calculators."],
    ["/guides", "All guides", "Simple, sourced protein and nutrition guides."],
    ["/meal-plan", "Personal protein meal plan", "Coming soon."],
    ...footerLinks.map((l): [string, string, string] => [l.href, l.label, `${site.name} ${l.label.toLowerCase()}.`]),
  ];
  for (const [u, t, d] of pages) docs.push({ u, t, d, k: "Page", x: "" });
  return docs;
}
