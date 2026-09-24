import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ArticleSchema, type Guide } from "@/lib/schema/article";

// Server-only: reads /content/articles/*.mdx. Invalid frontmatter throws, which fails the build.

const DIR = path.join(process.cwd(), "content", "articles");

/** Rough reading time at about 230 words a minute, rounded up. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 230));
}

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
      if (!existsSync(path.join(process.cwd(), "public", parsed.data.image.src))) {
        throw new Error(`content/articles/${file}: cover photo not found at public${parsed.data.image.src}`);
      }
      return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), body: content, readingMinutes: readingMinutes(content) };
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
