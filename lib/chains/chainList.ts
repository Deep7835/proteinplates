import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

// Reads /data/chain-list.csv (columns: chain, slug, country, category, official_nutrition_url, priority).

export type ChainListRow = {
  chain: string;
  slug: string;
  country: string;
  category: string;
  official_nutrition_url: string;
  priority: number;
};

export const CHAIN_LIST_PATH = path.join(process.cwd(), "data", "chain-list.csv");

/** Minimal CSV parser: handles quoted fields with commas and "" escapes. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);

  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

export function readChainList(file = CHAIN_LIST_PATH): ChainListRow[] {
  if (!existsSync(file)) return [];
  return parseCsv(readFileSync(file, "utf8")).map((r) => ({
    chain: r.chain,
    slug: r.slug,
    country: r.country,
    category: r.category,
    official_nutrition_url: r.official_nutrition_url,
    priority: Number(r.priority) || 3,
  }));
}
