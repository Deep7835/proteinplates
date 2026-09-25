import type { Chain, ChainItem } from "@/lib/schema/chain";

// Per-item pages: /chains/{chain}/{item}. Only for the chains listed here (people search item by item
// for these, e.g. "KFC smoky red chicken calories"), and only for items with a calorie number.
export const ITEM_PAGE_CHAINS = ["kfc-india", "mcdonalds-india", "burger-king-india", "dominos-india"] as const;

/** URL slug for an item name: "Smoky Red Chicken (2 pc)" → "smoky-red-chicken-2-pc". */
export function itemSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function hasItemPages(chain: Pick<Chain, "slug">): boolean {
  return (ITEM_PAGE_CHAINS as readonly string[]).includes(chain.slug);
}

export type ItemPage = { chain: Chain; item: ChainItem; slug: string };

/** Items that get their own page. Throws if two items would share a URL. */
export function itemPagesFor(chain: Chain): ItemPage[] {
  if (!hasItemPages(chain)) return [];
  const seen = new Map<string, string>();
  return chain.items
    .filter((item) => item.calories !== null)
    .map((item) => {
      const slug = itemSlug(item.name);
      const clash = seen.get(slug);
      if (clash) throw new Error(`${chain.slug}: "${item.name}" and "${clash}" would both use /chains/${chain.slug}/${slug}`);
      seen.set(slug, item.name);
      return { chain, item, slug };
    });
}

export function itemHref(chain: Pick<Chain, "slug">, item: Pick<ChainItem, "name" | "calories">): string | null {
  return hasItemPages(chain) && item.calories !== null ? `/chains/${chain.slug}/${itemSlug(item.name)}` : null;
}

/** "Smoky Red Chicken (2 pc)" → { base: "Smoky Red Chicken", pieces: 2 }. Null when the name has no piece count. */
export function pieceCount(name: string): { base: string; pieces: number } | null {
  const m = name.match(/^(.*?)\s*\((\d+)\s*pc\)\s*$/i);
  if (!m) return null;
  const pieces = Number(m[2]);
  return pieces > 0 ? { base: m[1].trim(), pieces } : null;
}

export type Portion = { pieces: number; calories: number; protein_g: number | null; carbs_g: number | null; fat_g: number | null };

const oneDecimal = (n: number) => Math.round(n * 10) / 10;

/**
 * Nutrition for other piece counts, scaled from the listed pack (e.g. 2 pc → 5 pc = × 2.5).
 * Pure arithmetic on the source's own numbers; pieces vary in size, so the page labels these as calculated.
 */
export function portionTable(item: ChainItem, counts = [1, 2, 3, 4, 5, 6, 8, 10]): Portion[] | null {
  const pc = pieceCount(item.name);
  if (!pc || item.calories === null) return null;
  const f = (v: number | null, n: number) => (v === null ? null : oneDecimal((v / pc.pieces) * n));
  const all = [...new Set([...counts, pc.pieces])].sort((a, b) => a - b);
  return all.map((n) => ({
    pieces: n,
    calories: Math.round((item.calories! / pc.pieces) * n),
    protein_g: f(item.protein_g, n),
    carbs_g: f(item.carbs_g, n),
    fat_g: f(item.fat_g, n),
  }));
}
