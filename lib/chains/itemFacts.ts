import { ACTIVITIES } from "@/lib/config/activities";
import { GOAL_RULES } from "@/lib/config/goals";
import type { Chain, ChainItem } from "@/lib/schema/chain";
import { isRankable, matchesRule, proteinPer100Cal, rankableItems, type RankableItem } from "./rank";

// Pure helpers for the per-item pages. Everything here is arithmetic on the item's own numbers.

/** Share of the item's calories from protein, carbs, and fat (4/4/9 kcal per gram). Null if any macro is missing. */
export function macroShare(item: ChainItem) {
  const { protein_g: p, carbs_g: c, fat_g: f } = item;
  if (p === null || c === null || f === null) return null;
  const kcal = { protein: p * 4, carbs: c * 4, fat: f * 9 };
  const total = kcal.protein + kcal.carbs + kcal.fat;
  if (total <= 0) return null;
  const pct = (k: number) => Math.round((k / total) * 100);
  return {
    protein: { grams: p, kcal: kcal.protein, percent: pct(kcal.protein) },
    carbs: { grams: c, kcal: kcal.carbs, percent: pct(kcal.carbs) },
    fat: { grams: f, kcal: kcal.fat, percent: pct(kcal.fat) },
    carbsClamped: false,
  };
}

const activity = (id: string) => {
  const a = ACTIVITIES.find((x) => x.id === id);
  if (!a) throw new Error(`Missing activity ${id}`);
  return a;
};

/** Reference body weights for "time to burn it off" (lb shown next to kg on the page). */
export const BURN_WEIGHTS_KG = [60, 80] as const;

/**
 * Minutes of an activity that burn about this many calories, using the Compendium formula
 * calories ≈ MET × kg × hours. Rounded to the nearest 5 minutes (it's an estimate).
 */
export function burnMinutes(calories: number, kg: number, met: number): number {
  return Math.max(5, Math.round(((calories / (met * kg)) * 60) / 5) * 5);
}

export function burnTable(calories: number) {
  const walk = activity("walk-brisk");
  const run = activity("run-6");
  return BURN_WEIGHTS_KG.map((kg) => ({
    kg,
    lb: Math.round(kg * 2.20462),
    walk: burnMinutes(calories, kg, walk.met),
    run: burnMinutes(calories, kg, run.met),
  }));
}
export const BURN_ACTIVITIES = { walk: activity("walk-brisk"), run: activity("run-6") };

/** Position among the chain's rankable items by protein per 100 calories (1 = best). */
export function proteinRank(chain: Chain, item: ChainItem): { rank: number; of: number } | null {
  if (!isRankable(item)) return null;
  const list = rankableItems(chain).sort((a, b) => b.protein_g / b.calories - a.protein_g / a.calories);
  const rank = list.findIndex((i) => i.name === item.name) + 1;
  return rank > 0 ? { rank, of: list.length } : null;
}

/**
 * Better protein-per-calorie options at the same chain: at least as much protein, no more than 10% more
 * calories, and a higher protein-per-100-calorie score. Falls back to the chain's top items if none qualify.
 */
export function higherProteinSwaps(chain: Chain, item: ChainItem, limit = 3): { items: RankableItem[]; fallback: boolean } {
  const others = rankableItems(chain).filter((i) => i.name !== item.name);
  const byPer100 = (a: RankableItem, b: RankableItem) => b.protein_g / b.calories - a.protein_g / a.calories;
  const mine = proteinPer100Cal(item);
  if (isRankable(item) && mine !== null) {
    const better = others
      .filter((i) => i.protein_g >= item.protein_g && i.calories <= item.calories * 1.1 && (proteinPer100Cal(i) ?? 0) > mine)
      .sort(byPer100)
      .slice(0, limit);
    if (better.length > 0) return { items: better, fallback: false };
  }
  return { items: others.sort(byPer100).slice(0, limit), fallback: true };
}

/** Which of the site's goal rules this item meets (same rules as the chain page's "Best orders by goal"). */
export function goalFits(item: ChainItem) {
  if (!isRankable(item)) return [];
  return GOAL_RULES.map((rule) => ({ rule, fits: matchesRule(item, rule.filter) }));
}

/** Share of a 2,000-calorie day, a common reference amount on nutrition labels. */
export function dailyShare(calories: number): number {
  return Math.round((calories / 2000) * 100);
}
