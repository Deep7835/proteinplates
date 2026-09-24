// npm run check-content
// Validates every guide and calculator page: frontmatter, MDX compiles, style rules
// (no em dashes, no banned AI phrases), and internal links that point to pages that don't exist.

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { getAllGuides } from "@/lib/guides/load";
import { getCalculatorPages } from "@/lib/calculators/pages";

const BANNED = [/—/, /In conclusion/i, /\bFurthermore\b/, /\bMoreover\b/, /fast-paced world/i];

const appDir = path.join(process.cwd(), "app");
const chainSlugs = new Set(readdirSync(path.join(process.cwd(), "data", "chains")).map((f) => f.replace(/\.json$/, "")));
const guideSlugs = new Set(readdirSync(path.join(process.cwd(), "content", "articles")).map((f) => f.replace(/\.mdx$/, "")));
const calcPages = getCalculatorPages(); // throws on invalid frontmatter
const calcPaths = new Set(calcPages.map((p) => (p.variant ? `/${p.slug}/${p.variant}` : `/${p.slug}`)));

function routeExists(href: string): boolean {
  const clean = href.split(/[?#]/)[0];
  if (clean === "/" || calcPaths.has(clean)) return true;
  const [, first, second] = clean.split("/");
  if (first === "chains" && second && !["top-protein-fast-food", "glp1-friendly"].includes(second)) return chainSlugs.has(second);
  if (first === "guides" && second) return guideSlugs.has(second);
  if (first === "for" && second) return ["glp1", "gym", "women", "men", "seniors"].includes(second);
  return existsSync(path.join(appDir, ...clean.split("/").filter(Boolean), "page.tsx"));
}

type Doc = { id: string; text: string; body: string; links: string[] };

async function check(doc: Doc): Promise<string[]> {
  const issues: string[] = [];
  for (const re of BANNED) if (re.test(doc.text)) issues.push(`banned pattern ${re}`);
  if (/^#\s/m.test(doc.body)) issues.push("body has an H1 (# ...); the page already renders the title as H1");
  for (const m of doc.body.matchAll(/\]\((\/[^)\s]*)\)/g)) if (!routeExists(m[1])) issues.push(`broken internal link ${m[1]}`);
  for (const l of doc.links) if (!routeExists(l)) issues.push(`link not found: ${l}`);
  try {
    await compile(doc.body, { remarkPlugins: [remarkGfm] });
  } catch (e) {
    issues.push(`MDX compile error: ${(e as Error).message.split("\n")[0]}`);
  }
  return issues;
}

async function main() {
let problems = 0;
const guides = getAllGuides(); // throws on invalid frontmatter
const report = (id: string, words: number, issues: string[]) => {
  console.log(`${issues.length ? "✗" : "✓"} ${id} (${words} words)`);
  for (const i of issues) console.log(`    - ${i}`);
  problems += issues.length;
};
for (const p of calcPages) {
  const id = `calculator ${p.variant ? `${p.slug}/${p.variant}` : p.slug}`;
  const text = `${p.title}\n${p.description}\n${p.intro}\n${p.body}\n${p.faqs.map((f) => f.question + f.answer).join("\n")}`;
  const links = p.related.map((r) => (r.startsWith("/") ? r : `/${r}`));
  report(id, p.body.split(/\s+/).filter(Boolean).length, await check({ id, text, body: p.body, links }));
}

for (const g of guides) {
  const text = `${g.title}\n${g.description}\n${g.body}\n${g.keyTakeaways.join("\n")}\n${g.faqs.map((f) => f.question + f.answer).join("\n")}`;
  report(`guide ${g.slug}`, g.body.split(/\s+/).filter(Boolean).length, await check({ id: g.slug, text, body: g.body, links: g.calculator ? [g.calculator] : [] }));
}

console.log(problems ? `\n${problems} problem(s)` : `\n✓ ${guides.length} guides and ${calcPages.length} calculator pages OK`);
process.exit(problems ? 1 : 0);
}

main();
