// Rules for "Best orders by goal", the summary cards, and GLP-1-friendly picks on chain pages.
// Edit the numbers here; every chain page updates on the next build.
// Only items with both protein and calories listed are ever ranked.
// A rule that uses sugar or fiber skips items where that value is null (we can't check it).

export type SortKey = "protein" | "proteinPer100Cal" | "glp1Score";

export type GoalRule = {
  id: string;
  label: string;
  description: string;
  filter: {
    minProteinG?: number;
    maxCalories?: number;
    minProteinPer100Cal?: number;
    /** Fat calories as a % of total calories (fat g × 9 ÷ calories). Items with null fat are skipped. */
    maxFatPctCalories?: number;
    maxSugarG?: number;
    minFiberG?: number;
    /** Item categories to leave out, e.g. ["drink", "side"]. Compared case-insensitively. */
    excludeItemCategories?: string[];
  };
  sortBy: SortKey;
  limit: number;
};

export const GOAL_RULES: GoalRule[] = [
  {
    id: "muscle-gain",
    label: "Muscle gain",
    description: "The most protein per order. Calories are higher, so these suit big eaters and heavy training days.",
    filter: { minProteinG: 30 },
    sortBy: "protein",
    limit: 5,
  },
  {
    id: "fat-loss",
    label: "Fat loss",
    description: "Lots of protein for the calories, and 600 calories or less.",
    filter: { maxCalories: 600, minProteinPer100Cal: 6 },
    sortBy: "proteinPer100Cal",
    limit: 5,
  },
  {
    id: "glp1",
    label: "GLP-1 friendly",
    description:
      "Smaller portions with at least 20 g protein, 10 g sugar or less, and no more than 35% of calories from fat. Higher fiber ranks higher.",
    // 35% fat = the top of the adult healthy range for fat (Institute of Medicine AMDR, 20–35%).
    filter: { minProteinG: 20, maxCalories: 450, maxSugarG: 10, maxFatPctCalories: 35 },
    sortBy: "glp1Score",
    limit: 5,
  },
  {
    id: "under-500",
    label: "Under 500 calories",
    description: "The highest-protein orders (15 g or more) that stay under 500 calories.",
    filter: { maxCalories: 499, minProteinG: 15 },
    sortBy: "protein",
    limit: 5,
  },
];

// GLP-1 score = protein_g + FIBER_WEIGHT × fiber_g − SUGAR_WEIGHT × sugar_g (after the GLP-1 filter).
export const GLP1_SCORE = { fiberWeight: 2, sugarWeight: 1 };

// Summary cards at the top of each chain page.
export const SUMMARY_RULES = {
  /** "Best low-calorie pick": best protein per 100 calories at or under this many calories. */
  lowCalMaxCalories: 400,
  /** "Best GLP-1-friendly pick" uses the rule with this id. */
  glp1RuleId: "glp1",
};

/**
 * Cross-chain rankings (Top 25 page, "best overall" card) compare single items, so multi-item
 * combos and set meals are left out there. They still show in each chain's own table.
 */
export const TOP_LIST = { limit: 25, excludeItemCategories: ["combo", "meal"] };

/** "Build a 40g+ protein meal" section. */
export const MEAL_BUILDER = { targetProteinG: 40, limit: 5 };
