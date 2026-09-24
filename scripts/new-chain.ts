// npm run new-chain -- --slug=xyz
// Creates data/chains/xyz.json from data/_template.json, pre-filled from data/chain-list.csv when possible.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { readChainList } from "@/lib/chains/chainList";

const arg = process.argv.slice(2).find((a) => a.startsWith("--slug="));
const slug = arg?.split("=")[1]?.trim() ?? "";

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-chain -- --slug=chain-name   (lowercase letters, numbers, and dashes)');
  process.exit(1);
}

const target = path.join(process.cwd(), "data", "chains", `${slug}.json`);
if (existsSync(target)) {
  console.error(`data/chains/${slug}.json already exists. Not overwriting it.`);
  process.exit(1);
}

const template = JSON.parse(readFileSync(path.join(process.cwd(), "data", "_template.json"), "utf8"));
const row = readChainList().find((r) => r.slug === slug);

template.slug = slug;
template.data_checked_date = new Date().toISOString().slice(0, 10);
if (row) {
  template.chain = row.chain;
  template.country = row.country.split(/[;|/ ]+/).filter(Boolean);
  template.category = row.category;
  template.official_nutrition_url = row.official_nutrition_url;
}

writeFileSync(target, `${JSON.stringify(template, null, 2)}\n`);
console.log(`Created data/chains/${slug}.json${row ? " (filled from chain-list.csv)" : " (slug not in chain-list.csv; fill in chain, country, category, and URL)"}.`);
console.log("Next: add items from the official nutrition source, then run: npm run validate-data");
