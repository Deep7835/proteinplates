import { z } from "zod";
import { GOALS } from "@/lib/config/protein";

// Frontmatter for /content/calculators/{slug}.mdx (main page) and /content/calculators/{slug}/{variant}.mdx
// (keyword landing pages like "protein calculator for women"). The build fails if a file doesn't match.

export const CALCULATOR_CATEGORIES = ["Protein & macros", "Calories & energy", "Body measurements", "Nutrients", "Activity"] as const;

export const PresetSchema = z
  .object({
    sex: z.enum(["male", "female"]).optional(),
    goal: z.enum(GOALS).optional(),
    units: z.enum(["us", "uk", "metric"]).optional(),
    activity: z.enum(["sedentary", "light", "moderate", "active", "very_active"]).optional(),
    age: z.number().int().min(18).max(100).optional(),
  })
  .strict();

export const CalculatorPageSchema = z
  .object({
    title: z.string().min(5), // H1
    metaTitle: z.string().min(10).max(70).optional(),
    description: z.string().min(50).max(170),
    name: z.string().min(3), // short name for cards, breadcrumbs, JSON-LD
    intro: z.string().min(20),
    category: z.enum(CALCULATOR_CATEGORIES).optional(), // required on main pages (checked in the loader)
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).min(2),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    related: z.array(z.string()).default([]), // other calculator slugs or paths
    preset: PresetSchema.optional(),
    primaryKeyword: z.string().optional(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict();

export type CalculatorPage = z.infer<typeof CalculatorPageSchema> & { slug: string; variant: string | null; body: string };
