import { MACRO_STYLES, type MacroStyle } from "@/lib/config/calories";
import { macroSplit, type MacroSplit } from "./macros";
import { calculateProteinPlan, type ProfileInput } from "./protein";

export type MacroPlan = {
  calories: number;
  maintenance: number;
  floorApplied: boolean;
  proteinRangeG: { min: number; max: number };
  macros: MacroSplit;
  /** Per-meal grams for 3 meals. */
  perMeal: { protein: number; carbs: number; fat: number };
};

/** Macro calculator: protein from the protein calculator, then a chosen fat share, carbs fill the rest. */
export function calculateMacroPlan(profile: ProfileInput, style: MacroStyle): MacroPlan {
  const plan = calculateProteinPlan(profile);
  const fatShare = MACRO_STYLES.find((s) => s.id === style)?.fatShare;
  if (fatShare === undefined) throw new Error(`Unknown macro style: ${style}`);
  const macros = macroSplit({ calories: plan.calories.target, proteinG: plan.proteinG.mid, fatShare });
  const per = (g: number) => Math.round(g / profile.mealsPerDay);
  return {
    calories: plan.calories.target,
    maintenance: plan.calories.maintenance,
    floorApplied: plan.calories.floorApplied,
    proteinRangeG: { min: plan.proteinG.min, max: plan.proteinG.max },
    macros,
    perMeal: { protein: per(macros.protein.grams), carbs: per(macros.carbs.grams), fat: per(macros.fat.grams) },
  };
}
