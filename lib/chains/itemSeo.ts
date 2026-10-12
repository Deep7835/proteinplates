import type { Chain, ChainItem } from "@/lib/schema/chain";
import { hasItemPages, itemSlug } from "./items";
import { isRankable, type RankableItem } from "./rank";

/**
 * Other names people search for an item, taken from Search Console queries (e.g. "mcpuff calories",
 * "mcdonald's softy calories"). Shown as "Also called" on the item page, in its FAQ, and in structured data.
 * Key: "{chain slug}/{item slug}". Only add names people really use.
 */
export const ITEM_ALIASES: Record<string, string[]> = {
  "mcdonalds-india/pizza-mcpuff": ["McPuff", "Mc Puff", "McDonald's pizza puff"],
  "mcdonalds-india/chicken-mcpuff": ["Chicken Puff", "Chicken Mc Puff"],
  "mcdonalds-india/mango-mcswirl-waffle-cone-regular": ["Mango McSwirl"],
  "mcdonalds-india/soft-serve-waffle-cone-regular": ["Soft serve waffle cone", "McDonald's waffle cone"],
  "mcdonalds-india/chocolate-brownie-sundae-regular": ["Brownie sundae", "Chocolate brownie sundae"],
  "mcdonalds-india/soft-serve-cone": ["Softy", "Soft serve"],
  "mcdonalds-india/aloo-tikki-burger": ["McAloo Tikki"],
  "mcdonalds-india/chicken-mcgrill-burger": ["Chicken McGrill", "McGrill"],
  "mcdonalds-india/mcspicy-paneer-wrap": ["McDonald's paneer wrap", "Mc paneer wrap"],
  "mcdonalds-india/fries-medium": ["Medium fries"],
  "mcdonalds-india/fries-large": ["Large fries"],
  "mcdonalds-india/fries-regular": ["Regular fries", "Small fries"],
  "burger-king-india/crispy-veg": ["Crispy Veg Burger"],
  "burger-king-india/crispy-chicken": ["Crispy Chicken Burger"],
  "kfc-india/hot-and-crispy-chicken-1-pc": ["KFC fried chicken", "Hot and Crispy Chicken"],
  "kfc-india/hot-and-crispy-chicken-2-pc": ["KFC fried chicken", "Hot and Crispy Chicken"],
  "kfc-india/smoky-red-chicken-2-pc": ["Smoky Red Grilled Chicken", "KFC grilled chicken"],
  "kfc-india/smoky-red-chicken-3-pc": ["Smoky Red Grilled Chicken", "KFC grilled chicken"],
};

export function aliasesFor(chain: Pick<Chain, "slug">, item: Pick<ChainItem, "name">): string[] {
  return ITEM_ALIASES[`${chain.slug}/${itemSlug(item.name)}`] ?? [];
}

/** "Farmhouse Pizza (Regular, New Hand Tossed)" → "Farmhouse Pizza (Regular)" for titles that must stay short. */
function shortName(name: string): string {
  return name.replace(/\(Regular, New Hand Tossed\)/, "(Regular)");
}

/**
 * Search title that answers the question up front, e.g. "Pizza McPuff Calories: 225 kcal, 5.5 g Protein | McDonald's India".
 * Kept to about 65 characters so phones show the numbers; drops the protein, then shortens the name if needed.
 */
export function itemTitle(chain: Pick<Chain, "chain">, item: ChainItem): string {
  const kcal = `${item.calories} kcal`;
  const protein = item.protein_g !== null ? `, ${item.protein_g} g Protein` : "";
  const options = [
    `${item.name} Calories: ${kcal}${protein} | ${chain.chain}`,
    `${shortName(item.name)} Calories: ${kcal}${protein} | ${chain.chain}`,
    `${shortName(item.name)} Calories: ${kcal} | ${chain.chain}`,
    `${shortName(item.name)} Calories: ${kcal}`,
  ];
  return options.find((t) => t.length <= 68) ?? options[options.length - 1];
}

/** Meta description that starts with the full answer, then says what else the page offers. */
export function itemDescription(chain: Pick<Chain, "chain">, item: ChainItem, aliases: string[]): string {
  const macros = [
    item.protein_g !== null && `${item.protein_g} g protein`,
    item.carbs_g !== null && `${item.carbs_g} g carbs`,
    item.fat_g !== null && `${item.fat_g} g fat`,
  ].filter(Boolean) as string[];
  const serving = item.serving_g ? ` per ${item.serving_g} g serving` : "";
  let text = `${chain.chain}’s ${item.name} has ${item.calories} calories${macros.length ? `, ${joinList(macros)}` : ""}${serving}.`;
  // Add the extras only while the whole description still fits in a search result (about 160 characters).
  for (const extra of [aliases.length > 0 ? ` Also called ${aliases[0]}.` : "", " See similar items and higher-protein swaps."]) {
    if (extra && text.length + extra.length <= 160) text += extra;
  }
  return text;
}

function joinList(parts: string[]): string {
  return parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** Nutrition per 100 g, worked out from the serving weight (only when the source gives one). */
export function per100g(value: number | null, servingG: number | null | undefined): number | null {
  if (value === null || !servingG) return null;
  return Math.round((value / servingG) * 1000) / 10;
}

// Words that say what an item is. Two items are "similar" when they share one of these and the same category.
const KIND_WORDS = [
  "paneer", "chicken", "veg", "egg", "fish", "mutton", "aloo",
  "fries", "nuggets", "wings", "strips", "popcorn", "wrap", "roll", "taco", "garlic", "lava", "sundae", "flurry",
  "soft", "cone", "softie", "pizza", "rice", "puff",
];

function kinds(name: string): Set<string> {
  const words = name.toLowerCase().replace(/softy/g, "softie").split(/[^a-z]+/);
  return new Set(KIND_WORDS.filter((k) => words.includes(k)));
}

export type SimilarItem = RankableItem & { chain: Pick<Chain, "chain" | "slug"> };

/**
 * Similar items at the other chains that have item pages: same category and at least one shared kind word
 * (e.g. "paneer" + burger), closest in calories first.
 */
export function similarItemsElsewhere(chain: Chain, item: ChainItem, all: Chain[], limit = 4): SimilarItem[] {
  const mine = kinds(item.name);
  if (mine.size === 0) return [];
  const results: { item: SimilarItem; score: number }[] = [];
  for (const other of all) {
    if (other.slug === chain.slug || !hasItemPages(other)) continue;
    for (const candidate of other.items) {
      if (!isRankable(candidate) || candidate.category.toLowerCase() !== item.category.toLowerCase()) continue;
      const shared = [...kinds(candidate.name)].filter((k) => mine.has(k)).length;
      if (shared === 0) continue;
      results.push({ item: { ...candidate, chain: { chain: other.chain, slug: other.slug } }, score: shared });
    }
  }
  const kcal = item.calories ?? 0;
  return results
    .sort((a, b) => b.score - a.score || Math.abs(a.item.calories - kcal) - Math.abs(b.item.calories - kcal))
    .slice(0, limit)
    .map((r) => r.item);
}
