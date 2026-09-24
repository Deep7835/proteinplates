import { GLP1_SCORE, GOAL_RULES, MEAL_BUILDER, SUMMARY_RULES, TOP_LIST, type GoalRule, type SortKey } from "@/lib/config/goals";
import { chainCurrency, type Chain, type ChainItem, type Currency } from "@/lib/schema/chain";
import { CURRENCY_DISPLAY } from "./format";

// Pure ranking helpers for chain pages. Every ranking goes through isRankable(), so items with
// null protein or calories can never appear in a pick, a goal list, or the top-25 page.

export type RankableItem = ChainItem & { protein_g: number; calories: number };

export function isRankable(item: ChainItem): item is RankableItem {
  return item.protein_g !== null && item.calories !== null && item.calories > 0;
}

/** Grams of protein per 100 calories, 1 decimal. Null when it can't be computed. */
export function proteinPer100Cal(item: ChainItem): number | null {
  if (!isRankable(item)) return null;
  return Math.round((item.protein_g / item.calories) * 1000) / 10;
}

export function glp1Score(item: RankableItem): number {
  return item.protein_g + GLP1_SCORE.fiberWeight * (item.fiber_g ?? 0) - GLP1_SCORE.sugarWeight * (item.sugar_g ?? 0);
}

const sorters: Record<SortKey, (a: RankableItem, b: RankableItem) => number> = {
  protein: (a, b) => b.protein_g - a.protein_g || a.calories - b.calories,
  proteinPer100Cal: (a, b) => b.protein_g / b.calories - a.protein_g / a.calories || b.protein_g - a.protein_g,
  glp1Score: (a, b) => glp1Score(b) - glp1Score(a) || a.calories - b.calories,
};

export function rankableItems(chain: Chain): RankableItem[] {
  return chain.items.filter(isRankable);
}

const isSingleItem = (i: ChainItem) => !TOP_LIST.excludeItemCategories.includes(i.category.toLowerCase());

export function matchesRule(item: RankableItem, filter: GoalRule["filter"]): boolean {
  const f = filter;
  if (f.minProteinG !== undefined && item.protein_g < f.minProteinG) return false;
  if (f.maxCalories !== undefined && item.calories > f.maxCalories) return false;
  if (f.minProteinPer100Cal !== undefined && (item.protein_g / item.calories) * 100 < f.minProteinPer100Cal) return false;
  if (f.maxFatPctCalories !== undefined && (item.fat_g === null || ((item.fat_g * 9) / item.calories) * 100 > f.maxFatPctCalories))
    return false;
  if (f.maxSugarG !== undefined && (item.sugar_g === null || item.sugar_g > f.maxSugarG)) return false;
  if (f.minFiberG !== undefined && (item.fiber_g === null || item.fiber_g < f.minFiberG)) return false;
  if (f.excludeItemCategories?.some((c) => c.toLowerCase() === item.category.toLowerCase())) return false;
  return true;
}

export function applyRule(items: RankableItem[], rule: GoalRule): RankableItem[] {
  return items.filter((i) => matchesRule(i, rule.filter)).sort(sorters[rule.sortBy]).slice(0, rule.limit);
}

export type GoalPicks = { rule: GoalRule; items: RankableItem[] };

export function goalPicks(chain: Chain): GoalPicks[] {
  const items = rankableItems(chain);
  return GOAL_RULES.map((rule) => ({ rule, items: applyRule(items, rule) }));
}

export type SummaryPicks = {
  bestOverall: RankableItem | null;
  bestLowCal: RankableItem | null;
  bestGlp1: RankableItem | null;
};

export function summaryPicks(chain: Chain): SummaryPicks {
  const items = rankableItems(chain);
  const glp1Rule = GOAL_RULES.find((r) => r.id === SUMMARY_RULES.glp1RuleId);
  return {
    bestOverall: items.filter(isSingleItem).sort(sorters.protein)[0] ?? null,
    bestLowCal: items.filter((i) => i.calories <= SUMMARY_RULES.lowCalMaxCalories).sort(sorters.proteinPer100Cal)[0] ?? null,
    bestGlp1: glp1Rule ? (applyRule(items, glp1Rule)[0] ?? null) : null,
  };
}

/** Items with an order tip, 40 g+ protein first, for "Build a 40g+ protein meal". */
export function mealBuilderItems(chain: Chain): RankableItem[] {
  return rankableItems(chain)
    .filter((i) => i.custom_order_tip.trim() !== "")
    .sort((a, b) => Number(b.protein_g >= MEAL_BUILDER.targetProteinG) - Number(a.protein_g >= MEAL_BUILDER.targetProteinG) || sorters.protein(a, b))
    .slice(0, MEAL_BUILDER.limit);
}

export type PricedItem = RankableItem & { price: number; proteinPerUnit: number };

/** Protein per $1, £1, or ₹100 (see CURRENCY_DISPLAY). Empty when no item has a price. */
export function proteinPerPrice(chain: Chain, limit = 5): { currency: Currency; items: PricedItem[] } {
  const currency = chainCurrency(chain);
  const per = CURRENCY_DISPLAY[currency].per;
  const items = rankableItems(chain)
    .filter((i): i is RankableItem & { price: number } => typeof i.price === "number" && i.price > 0)
    .map((i) => ({ ...i, proteinPerUnit: Math.round(((i.protein_g * per) / i.price) * 10) / 10 }))
    .sort((a, b) => b.proteinPerUnit - a.proteinPerUnit)
    .slice(0, limit);
  return { currency, items };
}

export type ItemWithChain = RankableItem & { chain: Pick<Chain, "chain" | "slug" | "country"> };

/** Highest-protein items across every chain (ties: fewer calories first). */
export function topProteinAcrossChains(chains: Chain[], limit = TOP_LIST.limit): ItemWithChain[] {
  return chains
    .flatMap((c) =>
      rankableItems(c)
        .filter(isSingleItem)
        .map((i) => ({ ...i, chain: { chain: c.chain, slug: c.slug, country: c.country } })),
    )
    .sort(sorters.protein)
    .slice(0, limit);
}

/** Best items across every chain for one goal rule (e.g. hub pages), at most `perChain` from each chain. */
export function topAcrossChainsByRule(chains: Chain[], rule: GoalRule, limit = 8, perChain = 2): ItemWithChain[] {
  const picks = chains.flatMap((c) =>
    applyRule(rankableItems(c), { ...rule, limit: perChain }).map((i) => ({ ...i, chain: { chain: c.chain, slug: c.slug, country: c.country } })),
  );
  return picks.sort(sorters[rule.sortBy]).slice(0, limit);
}

/** Same category first, then same country, then the rest. */
export function relatedChains(chain: Chain, all: Chain[], limit = 4): Chain[] {
  const score = (c: Chain) => (c.category === chain.category ? 2 : 0) + (c.country.some((x) => chain.country.includes(x)) ? 1 : 0);
  return all
    .filter((c) => c.slug !== chain.slug)
    .sort((a, b) => score(b) - score(a) || a.chain.localeCompare(b.chain))
    .slice(0, limit);
}

/** Latest data_checked_date across chains (YYYY-MM-DD), or null. */
export function latestCheckDate(chains: Chain[]): string | null {
  return chains.reduce<string | null>((max, c) => (max === null || c.data_checked_date > max ? c.data_checked_date : max), null);
}
