import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Chain } from "@/lib/schema/chain";
import { readChainList } from "./chainList";
import { validateChainFile } from "./validate";

// Server-only: reads every /data/chains/*.json at build time.
// Any invalid file throws, which fails `next build`. Files starting with "_" (the template) are skipped.
// CHAIN_DATA_DIR can point at test fixtures for local previews; production always uses data/chains.

export const CHAIN_DATA_DIR = process.env.CHAIN_DATA_DIR
  ? path.resolve(process.env.CHAIN_DATA_DIR)
  : path.join(process.cwd(), "data", "chains");

export function chainFileNames(dir = CHAIN_DATA_DIR): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort();
}

let cache: Chain[] | null = null;

export function getAllChains(): Chain[] {
  // Cache only in production builds, so edits to data/chains show up right away in `npm run dev`.
  if (cache && process.env.NODE_ENV === "production") return cache;
  const chains = chainFileNames().map((file) => {
    const result = validateChainFile(file, readFileSync(path.join(CHAIN_DATA_DIR, file), "utf8"));
    if (!result.ok) {
      throw new Error(`Invalid chain data in data/chains/${file}:\n  - ${result.errors.join("\n  - ")}`);
    }
    return roundForDisplay(result.chain);
  });
  cache = chains.sort((a, b) => a.chain.localeCompare(b.chain));
  return cache;
}

/** Rounds nutrient grams to 1 decimal and calories/sodium to whole numbers for display. JSON files stay exact. */
function roundForDisplay(chain: Chain): Chain {
  const r1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);
  const r0 = (n: number | null) => (n === null ? null : Math.round(n));
  return {
    ...chain,
    items: chain.items.map((i) => ({
      ...i,
      calories: r0(i.calories),
      sodium_mg: r0(i.sodium_mg),
      protein_g: r1(i.protein_g),
      carbs_g: r1(i.carbs_g),
      fat_g: r1(i.fat_g),
      fiber_g: r1(i.fiber_g),
      sugar_g: r1(i.sugar_g),
    })),
  };
}

export function getChain(slug: string): Chain | undefined {
  return getAllChains().find((c) => c.slug === slug);
}

/** Chains ordered by chain-list.csv priority (1 first), then name. */
export function getChainsByPriority(): Chain[] {
  const priority = new Map(readChainList().map((r) => [r.slug, r.priority]));
  return [...getAllChains()].sort((a, b) => (priority.get(a.slug) ?? 3) - (priority.get(b.slug) ?? 3) || a.chain.localeCompare(b.chain));
}

export function featuredChainLinks(limit = 6) {
  return getChainsByPriority()
    .slice(0, limit)
    .map((c) => ({ href: `/chains/${c.slug}`, label: c.chain }));
}
