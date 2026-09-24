import type { ChainCardData } from "@/components/chains/ChainCard";
import type { Chain } from "@/lib/schema/chain";
import { CATEGORY_LABELS, COUNTRY_LABELS } from "./format";
import { summaryPicks } from "./rank";

export function toCardData(chain: Chain): ChainCardData {
  const top = summaryPicks(chain).bestOverall;
  return {
    slug: chain.slug,
    name: chain.chain,
    country: chain.country,
    countryLabels: chain.country.map((c) => COUNTRY_LABELS[c]),
    category: chain.category,
    categoryLabel: CATEGORY_LABELS[chain.category],
    topPick: top ? { name: top.name, protein: top.protein_g } : null,
    glp1Menu: chain.glp1_menu_name,
  };
}
