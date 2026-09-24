import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CalculatorPageSchema, type CalculatorPage } from "@/lib/schema/calculatorPage";

// Server-only: reads calculator page content. Invalid frontmatter throws, which fails the build.

const DIR = path.join(process.cwd(), "content", "calculators");

function read(file: string, slug: string, variant: string | null): CalculatorPage {
  const { data, content } = matter(readFileSync(file, "utf8"));
  const parsed = CalculatorPageSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n  - ");
    throw new Error(`Invalid frontmatter in ${path.relative(process.cwd(), file)}:\n  - ${issues}`);
  }
  if (!variant && !parsed.data.category) throw new Error(`${path.relative(process.cwd(), file)} needs a category`);
  return { ...parsed.data, slug, variant, body: content };
}

let cache: CalculatorPage[] | null = null;

export function getCalculatorPages(): CalculatorPage[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const pages: CalculatorPage[] = [];
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".mdx"))) {
    const slug = f.replace(/\.mdx$/, "");
    pages.push(read(path.join(DIR, f), slug, null));
    const vdir = path.join(DIR, slug);
    if (existsSync(vdir)) {
      for (const v of readdirSync(vdir).filter((x) => x.endsWith(".mdx"))) pages.push(read(path.join(vdir, v), slug, v.replace(/\.mdx$/, "")));
    }
  }
  cache = pages;
  return pages;
}

export const mainCalculatorPages = () => getCalculatorPages().filter((p) => p.variant === null);
export const calculatorVariants = (slug: string) => getCalculatorPages().filter((p) => p.slug === slug && p.variant !== null);
export const getCalculatorPage = (slug: string, variant: string | null = null) =>
  getCalculatorPages().find((p) => p.slug === slug && p.variant === variant);
