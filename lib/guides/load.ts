import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ArticleSchema, type Guide } from "@/lib/schema/article";

// Server-only: reads /content/articles/*.mdx. Invalid frontmatter throws, which fails the build.

const DIR = path.join(process.cwd(), "content", "articles");

function load(): Guide[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(readFileSync(path.join(DIR, file), "utf8"));
      const parsed = ArticleSchema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n  - ");
        throw new Error(`Invalid frontmatter in content/articles/${file}:\n  - ${issues}`);
      }
      return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), body: content };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

let cache: Guide[] | null = null;

export function getAllGuides(): Guide[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = load();
  return cache;
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function guidesForAudience(audience: string): Guide[] {
  return getAllGuides().filter((g) => g.audience.includes(audience));
}
