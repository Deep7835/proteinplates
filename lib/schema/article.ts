import { z } from "zod";
import { audiences } from "@/lib/config/site";

// Frontmatter for /content/articles/{slug}.mdx. The build fails if any guide doesn't match.

const AUDIENCE_SLUGS = audiences.map((a) => a.slug) as [string, ...string[]];
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const ArticleSchema = z
  .object({
    title: z.string().min(10),
    description: z.string().min(50).max(170),
    date: isoDate,
    updated: isoDate,
    author: z.string().min(1),
    reviewedBy: z.string().min(1).nullable(),
    tags: z.array(z.string()).default([]),
    // One audience or a list, e.g. audience: glp1  or  audience: [gym, men]
    audience: z.union([z.enum(AUDIENCE_SLUGS), z.array(z.enum(AUDIENCE_SLUGS)).min(1)]).transform((a) => (Array.isArray(a) ? a : [a])),
    keyTakeaways: z.array(z.string()).min(2).max(6),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).min(2),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
    relatedChains: z.array(z.string()).default([]),
    // SEO extras (optional). metaTitle overrides <title>; the rest document how the article was written.
    metaTitle: z.string().min(10).max(70).optional(),
    primaryKeyword: z.string().optional(),
    articleType: z.string().optional(),
    sentimentTarget: z.string().optional(),
    /** Calculator page this article supports, e.g. "/fiber-calculator". Shown as the main call to action. */
    calculator: z.string().regex(/^\/[a-z0-9-]+$/).optional(),
  })
  .strict();

export type ArticleFrontmatter = z.infer<typeof ArticleSchema>;
export type Guide = ArticleFrontmatter & { slug: string; body: string };
