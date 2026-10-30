// node scripts/check-articles.mjs [slug ...]
// Checks guide articles against the house writing rules, and compares each one with its last committed
// version so a rewrite can't quietly change the facts:
// - The body opens with a question (### ...?) and a 40 to 60 word answer that ends within the first 80 words.
// - 4 to 6 FAQs, each answer 40 to 60 words, and 2 to 6 key takeaways.
// - No em or en dashes, no banned phrases, no made-up first-hand experience ("I tested", "my clients").
// - Every number in the new text was already in the old text (lb/kg conversions and the like get flagged for a
//   human to check), and every link and source URL is kept.
// Exit code 1 if anything fails.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = "content/articles";
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));

const BANNED = [/in conclusion/i, /furthermore/i, /moreover/i, /in today's fast-paced world/i, /delve/i];
const FAKE_EXPERIENCE = [/\bI (tested|tried|ate|weighed|measured|coached|ordered|visited)\b/i, /\bmy (clients?|patients?)\b/i, /\bas a (dietitian|doctor|nutritionist)\b/i];
const words = (s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`#>|]/g, " ").split(/\s+/).filter(Boolean).length;
const numbers = (s) => new Set((s.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, "").match(/\d[\d,]*(\.\d+)?/g) ?? []).map((n) => n.replace(/,/g, "")));
const urls = (s) => new Set(s.match(/https?:\/\/[^\s)"'>]+|\]\(\/[^)]+\)/g) ?? []);

let failed = 0;
for (const slug of slugs) {
  const file = path.join(DIR, `${slug}.mdx`);
  const now = readFileSync(file, "utf8");
  let before;
  try {
    before = execFileSync("git", ["show", `HEAD:${file}`], { encoding: "utf8" });
  } catch {
    before = now;
  }
  const { data, content } = matter(now);
  const errors = [];
  const warnings = [];

  const lines = content.split("\n").filter((l) => l.trim() !== "");
  if (!/^### .+\?$/.test(lines[0] ?? "")) errors.push(`body must open with "### Question?" (found: ${(lines[0] ?? "").slice(0, 60)})`);
  else {
    const answer = lines[1] ?? "";
    const n = words(answer);
    if (n < 40 || n > 60) errors.push(`lead answer is ${n} words (want 40 to 60)`);
    if (words(lines[0]) + n > 80) errors.push(`lead answer ends after word ${words(lines[0]) + n} (want 80 or less)`);
  }
  const faqs = data.faqs ?? [];
  if (faqs.length < 4 || faqs.length > 6) errors.push(`${faqs.length} FAQs (want 4 to 6)`);
  faqs.forEach((f, i) => {
    const n = words(f.answer);
    if (n < 40 || n > 60) errors.push(`FAQ ${i + 1} answer is ${n} words (want 40 to 60): ${f.question}`);
    if (!f.question.trim().endsWith("?")) errors.push(`FAQ ${i + 1} question should end with "?"`);
  });

  const text = [content, data.title, data.description, data.metaTitle ?? "", ...(data.keyTakeaways ?? []), ...faqs.flatMap((f) => [f.question, f.answer])].join("\n");
  if (/[—–]|&mdash;|&ndash;| -- /.test(text)) errors.push("contains an em or en dash");
  for (const re of BANNED) if (re.test(text)) errors.push(`banned phrase: ${re.source}`);
  for (const re of FAKE_EXPERIENCE) if (re.test(text)) errors.push(`claims first-hand experience: ${text.match(re)[0]}`);
  if (data.description && (data.description.length < 120 || data.description.length > 160)) warnings.push(`description is ${data.description.length} chars (aim for 120 to 160)`);
  if (data.metaTitle && data.metaTitle.length > 60) warnings.push(`metaTitle is ${data.metaTitle.length} chars (aim for 60 or less)`);

  const oldNums = numbers(before);
  const added = [...numbers(text)].filter((n) => !oldNums.has(n));
  if (added.length) warnings.push(`numbers not in the old version (check each one): ${added.join(", ")}`);
  const newUrls = urls(now);
  const lost = [...urls(before)].filter((u) => !newUrls.has(u));
  if (lost.length) errors.push(`links or sources removed: ${lost.join(", ")}`);

  const status = errors.length ? "FAIL" : "ok  ";
  if (errors.length) failed++;
  console.log(`${status} ${slug} (${words(content)} words)`);
  for (const e of errors) console.log(`     ✗ ${e}`);
  for (const w of warnings) console.log(`     ! ${w}`);
}
process.exit(failed ? 1 : 0);
