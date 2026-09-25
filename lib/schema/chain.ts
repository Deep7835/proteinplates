import { z } from "zod";

// Schema for /data/chains/{slug}.json. The build fails if any file doesn't match.
// Numbers are null when the chain's official source doesn't list them (never estimated).

export const COUNTRIES = ["US", "UK", "IN"] as const;
export type Country = (typeof COUNTRIES)[number];

// Add a category here before using it in a chain file.
export const CHAIN_CATEGORIES = [
  "burgers",
  "chicken",
  "mexican",
  "sandwiches",
  "coffee",
  "bakery",
  "healthy",
  "asian",
  "pizza",
  "smoothies",
  "indian",
] as const;
export type ChainCategory = (typeof CHAIN_CATEGORIES)[number];

const nutrient = z.number().nonnegative().nullable();

function isoDateString() {
  return z.string().refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)), {
    message: "Must be a real date in YYYY-MM-DD format",
  });
}

export const ChainItemSchema = z
  .object({
    name: z.string().trim().min(1),
    category: z.string().trim().min(1), // bowl, burger, salad, breakfast, drink, side...
    calories: nutrient,
    protein_g: nutrient,
    carbs_g: nutrient,
    fat_g: nutrient,
    fiber_g: nutrient,
    sugar_g: nutrient,
    sodium_mg: nutrient,
    // Optional. Local currency: GBP for UK-only chains, INR for India-only chains, USD otherwise.
    price: z.number().positive().nullable().optional(),
    /** Optional serving weight in grams, as the source lists it. */
    serving_g: z.number().positive().nullable().optional(),
    /**
     * Optional. Set only when THIS item's numbers come from somewhere other than the chain's own source
     * (e.g. the chain's official data doesn't list it). Shown next to the item on the site.
     */
    source: z
      .object({
        name: z.string().trim().min(1),
        url: z.url({ protocol: /^https$/ }),
        checked: isoDateString(),
      })
      .strict()
      .optional(),
    custom_order_tip: z.string(),
  })
  .strict();

const isoDate = isoDateString();

export const ChainSchema = z
  .object({
    chain: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single dashes"),
    country: z.array(z.enum(COUNTRIES)).min(1),
    category: z.enum(CHAIN_CATEGORIES),
    official_nutrition_url: z.url({ protocol: /^https$/ }),
    data_checked_date: isoDate,
    intro_notes: z.string(),
    glp1_menu_name: z.string().trim().min(1).nullable(),
    reviewed_by: z.string().trim().min(1).nullable(),
    // "official" (default): the chain's own site, PDF, or app. "third_party": the chain publishes no
    // nutrition data itself, so numbers come from another site (named in source_name). Shown on the page.
    source_type: z.enum(["official", "third_party"]).default("official"),
    source_name: z.string().trim().min(1).nullable().default(null),
    items: z.array(ChainItemSchema).min(1),
  })
  .strict()
  .superRefine((chain, ctx) => {
    if (chain.source_type === "third_party" && !chain.source_name)
      ctx.addIssue({ code: "custom", path: ["source_name"], message: "Name the third-party source" });
    const seen = new Set<string>();
    chain.items.forEach((item, i) => {
      const key = item.name.toLowerCase();
      if (seen.has(key)) ctx.addIssue({ code: "custom", path: ["items", i, "name"], message: `Duplicate item name "${item.name}"` });
      seen.add(key);
    });
    if (new Set(chain.country).size !== chain.country.length)
      ctx.addIssue({ code: "custom", path: ["country"], message: "Country listed twice" });
  });

export type Chain = z.infer<typeof ChainSchema>;
export type ChainItem = z.infer<typeof ChainItemSchema>;

export const NUTRIENT_FIELDS = ["calories", "protein_g", "carbs_g", "fat_g", "fiber_g", "sugar_g", "sodium_mg"] as const;
export type NutrientField = (typeof NUTRIENT_FIELDS)[number];

export type Currency = "USD" | "GBP" | "INR";

/** Single-country chains price in local currency (UK → GBP, IN → INR). Multi-country chains use USD. */
export function chainCurrency(chain: Pick<Chain, "country">): Currency {
  if (chain.country.length !== 1) return "USD";
  return ({ US: "USD", UK: "GBP", IN: "INR" } as const)[chain.country[0]];
}
