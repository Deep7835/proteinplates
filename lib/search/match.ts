import type { SearchDoc } from "./index";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Simple ranked search: every word must match somewhere. Title matches score highest,
 * then description, then hidden keywords (menu items, tags). No library needed.
 */
export const SEARCH_LIMIT = 30;

export function searchDocs(docs: SearchDoc[], query: string, limit = SEARCH_LIMIT): SearchDoc[] {
  const words = norm(query).split(" ").filter((w) => w.length > 0);
  if (words.length === 0) return [];
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of docs) {
    const t = norm(doc.t);
    const d = norm(doc.d);
    const x = norm(doc.x);
    let score = 0;
    let all = true;
    for (const w of words) {
      const s = (t.includes(w) ? 10 : 0) + (d.includes(w) ? 3 : 0) + (x.includes(w) ? 1 : 0);
      if (s === 0) {
        all = false;
        break;
      }
      score += s + (t.startsWith(w) || t.includes(` ${w}`) ? 2 : 0);
    }
    if (all) scored.push({ doc, score: score + (doc.k === "Calculator" && !doc.u.slice(1).includes("/") ? 1 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score || a.doc.t.length - b.doc.t.length).slice(0, limit).map((s) => s.doc);
}
