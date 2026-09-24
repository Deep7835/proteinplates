// npm run validate-data
// Validates every data/chains/*.json with Zod and reports nulls, stale files, and likely typos.
// Exits with code 1 on any error (runs automatically before `npm run build`).

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CHAIN_LIST_PATH, parseCsv, readChainList } from "@/lib/chains/chainList";
import { CHAIN_DATA_DIR, chainFileNames } from "@/lib/chains/load";
import { isRankable } from "@/lib/chains/rank";
import { validateChainFile } from "@/lib/chains/validate";
import { NUTRIENT_FIELDS, type Chain } from "@/lib/schema/chain";

const STALE_AFTER_DAYS = 60;
const TODO_PATH = path.join(process.cwd(), "data", "TODO-verify.csv");
const usingFixtures = Boolean(process.env.CHAIN_DATA_DIR);

const errors: string[] = [];
const warnings: string[] = [];
const out: string[] = [];

const todoRows = existsSync(TODO_PATH) ? parseCsv(readFileSync(TODO_PATH, "utf8")) : [];
const todoKey = (chain: string, item: string, field: string) => `${chain}|${item}|${field}`.toLowerCase();
const todoKeys = new Set(todoRows.map((r) => todoKey(r.chain, r.item, r.field)));
const chainList = readChainList();
const listed = new Map(chainList.map((r) => [r.slug, r]));

const today = new Date();
const daysSince = (iso: string) => Math.floor((today.getTime() - Date.parse(`${iso}T00:00:00Z`)) / 86_400_000);

const files = chainFileNames();
const valid: Chain[] = [];

for (const file of files) {
  const result = validateChainFile(file, readFileSync(path.join(CHAIN_DATA_DIR, file), "utf8"));
  if (!result.ok) {
    errors.push(`${file}:\n    - ${result.errors.join("\n    - ")}`);
    continue;
  }
  const chain = result.chain;
  valid.push(chain);
  const lines: string[] = [];

  // Null fields, grouped by field.
  for (const field of NUTRIENT_FIELDS) {
    const missing = chain.items.filter((i) => i[field] === null).map((i) => i.name);
    if (missing.length) lines.push(`null ${field}: ${missing.length} (${missing.join(", ")})`);
    for (const item of missing) {
      if (!todoKeys.has(todoKey(chain.slug, item, field)) && !todoKeys.has(todoKey(chain.slug, "(all items)", field)))
        warnings.push(`${chain.slug}: "${item}" ${field} is null but has no row in data/TODO-verify.csv`);
    }
  }
  const unranked = chain.items.filter((i) => !isRankable(i)).map((i) => i.name);
  if (unranked.length) lines.push(`not ranked (null protein or calories): ${unranked.join(", ")}`);

  // Stale check.
  const age = daysSince(chain.data_checked_date);
  if (age > STALE_AFTER_DAYS) warnings.push(`${chain.slug}: data is ${age} days old (checked ${chain.data_checked_date}). Re-check the official source.`);
  if (age < 0) errors.push(`${chain.slug}: data_checked_date ${chain.data_checked_date} is in the future`);

  // Likely typos: calories far from 4×protein + 4×net carbs + 2×fiber + 9×fat (fiber gives ~2 kcal/g).
  // UK labels already list carbs without fibre; US/India labels include fiber in total carbs.
  const ukCarbs = chain.country.length === 1 && chain.country[0] === "UK";
  for (const i of chain.items) {
    if (i.calories === null || i.protein_g === null || i.carbs_g === null || i.fat_g === null) continue;
    const fiber = Math.min(i.fiber_g ?? 0, ukCarbs ? Infinity : i.carbs_g);
    const netCarbs = ukCarbs ? i.carbs_g : i.carbs_g - fiber;
    const est = 4 * i.protein_g + 4 * netCarbs + 2 * fiber + 9 * i.fat_g;
    if (Math.abs(est - i.calories) > Math.max(40, i.calories * 0.2))
      warnings.push(`${chain.slug}: "${i.name}" lists ${i.calories} cal but its macros add up to ~${Math.round(est)} cal. Check for a typo.`);
  }

  // Must be in chain-list.csv (skipped for fixture previews).
  if (!usingFixtures) {
    const row = listed.get(chain.slug);
    if (!row) errors.push(`${chain.slug}: not listed in data/chain-list.csv`);
    else if (row.official_nutrition_url && row.official_nutrition_url !== chain.official_nutrition_url)
      warnings.push(`${chain.slug}: official_nutrition_url differs from data/chain-list.csv`);
  }

  out.push(`✓ ${chain.slug} (${chain.items.length} items, ${chain.items.length - unranked.length} ranked, checked ${chain.data_checked_date}, ${age} days ago)`);
  for (const l of lines) out.push(`    ${l}`);
}

// TODO rows that point at values that are now filled in.
for (const r of todoRows) {
  const chain = valid.find((c) => c.slug === r.chain);
  const item = chain?.items.find((i) => i.name.toLowerCase() === r.item.toLowerCase());
  const field = r.field as (typeof NUTRIENT_FIELDS)[number];
  if (chain && item && NUTRIENT_FIELDS.includes(field) && item[field] !== null)
    warnings.push(`TODO-verify.csv: ${r.chain} / ${r.item} / ${r.field} now has a value. Remove the row once it is resolved.`);
}

console.log(`Chain data: ${usingFixtures ? `${CHAIN_DATA_DIR} (fixtures)` : "data/chains"}`);
if (!usingFixtures && !existsSync(CHAIN_LIST_PATH)) warnings.push("data/chain-list.csv not found");
console.log(files.length === 0 ? "(no chain files yet)" : out.join("\n"));
if (warnings.length) console.log(`\n⚠ ${warnings.length} warning(s):\n  - ${warnings.join("\n  - ")}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`\n✓ ${valid.length} chain file(s) valid.`);
