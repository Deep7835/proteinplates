import type { Goal } from "./protein";

// Calorie settings used by the protein, TDEE, and macro calculators.

// Standard activity multipliers applied to Mifflin-St Jeor BMR (Mifflin et al., Am J Clin Nutr 1990,
// PMID 2305711, gives the BMR equation; these multipliers are the widely used convention).
export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", description: "Desk job, little or no exercise", factor: 1.2 },
  { id: "light", label: "Lightly active", description: "Light exercise 1–3 days a week", factor: 1.375 },
  { id: "moderate", label: "Moderately active", description: "Exercise 3–5 days a week", factor: 1.55 },
  { id: "active", label: "Very active", description: "Hard exercise 6–7 days a week", factor: 1.725 },
  { id: "very_active", label: "Extremely active", description: "Hard daily training or a physical job", factor: 1.9 },
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]["id"];
export const ACTIVITY_IDS = ACTIVITY_LEVELS.map((a) => a.id) as ActivityLevel[];

// Share of maintenance calories added (+) or removed (−) for each goal. VERIFY.
export const GOAL_CALORIE_ADJUSTMENT: Record<Goal, number> = {
  lose: -0.2,
  maintain: 0,
  build: 0.1,
  glp1: -0.15,
  aging: 0,
};

// We never suggest a daily target below these. VERIFY: common guidance floors, not a single source.
export const CALORIE_FLOOR = { female: 1200, male: 1500 } as const;

// Macro split: fat gets a fixed share of calories, protein uses the midpoint of the protein range,
// carbs get the rest.
export const FAT_SHARE_OF_CALORIES = 0.3;

// Fat options on the macro calculator. All stay inside the adult AMDR for fat of 20–35% of
// calories (Institute of Medicine DRI, 2005, https://doi.org/10.17226/10490).
export const MACRO_STYLES = [
  { id: "lower_fat", label: "Lower fat (20% fat)", fatShare: 0.2 },
  { id: "balanced", label: "Balanced (30% fat)", fatShare: 0.3 },
  { id: "higher_fat", label: "Higher fat, lower carb (35% fat)", fatShare: 0.35 },
] as const;

export type MacroStyle = (typeof MACRO_STYLES)[number]["id"];

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;
