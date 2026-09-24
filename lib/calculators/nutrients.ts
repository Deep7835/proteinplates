import { CARBS, FIBER, SUGAR, WATER } from "@/lib/config/guidelines";
import { KCAL_PER_GRAM } from "@/lib/config/calories";
import type { Sex } from "./tdee";

/** Fiber: 14 g per 1,000 kcal, plus the adequate intake for age and sex (IOM 2005). */
export function fiberTargets(input: { sex: Sex; age: number; calories: number }) {
  const ai = FIBER.adequateIntake[input.sex][input.age > 50 ? "over50" : "upTo50"];
  return { byCalories: Math.round((input.calories / 1000) * FIBER.gramsPer1000Kcal), adequateIntake: ai };
}

/** Carbs: AMDR 45–65% of calories in grams, and the 130 g RDA (IOM 2005). */
export function carbTargets(calories: number) {
  const g = (pct: number) => Math.round((calories * pct) / 100 / KCAL_PER_GRAM.carbs);
  return { min: g(CARBS.amdrPct.min), max: g(CARBS.amdrPct.max), rda: CARBS.rdaGrams };
}

/** Keto macros: carbs fixed (e.g. 20–50 g), protein from the protein calculator, fat fills the rest. */
export function ketoMacros(input: { calories: number; carbsG: number; proteinG: number }) {
  const carbKcal = input.carbsG * KCAL_PER_GRAM.carbs;
  const proteinKcal = input.proteinG * KCAL_PER_GRAM.protein;
  const fatKcal = Math.max(0, input.calories - carbKcal - proteinKcal);
  const pct = (k: number) => Math.round((k / input.calories) * 100);
  return {
    carbs: { grams: input.carbsG, percent: pct(carbKcal) },
    protein: { grams: input.proteinG, percent: pct(proteinKcal) },
    fat: { grams: Math.round(fatKcal / KCAL_PER_GRAM.fat), percent: pct(fatKcal) },
  };
}

/** Sugar limits: WHO free sugars (10% and 5% of calories) and AHA added sugars (100/150 kcal). */
export function sugarLimits(input: { sex: Sex; calories: number }) {
  const grams = (pct: number) => Math.round((input.calories * pct) / 100 / SUGAR.kcalPerGram);
  const aha = SUGAR.aha[input.sex];
  return {
    whoMax: grams(SUGAR.whoMaxPct),
    whoIdeal: grams(SUGAR.whoIdealPct),
    aha: { grams: aha.grams, teaspoons: aha.teaspoons },
  };
}

/** Water: National Academies and EFSA total-water intakes; drinks are about 80% of the total. */
export function waterTargets(sex: Sex) {
  const total = WATER.nasemTotalL[sex];
  const efsa = WATER.efsaTotalL[sex];
  const drinks = (l: number) => Math.round(l * (1 - WATER.shareFromFood) * 10) / 10;
  return { nasemTotalL: total, nasemFromDrinksL: drinks(total), efsaTotalL: efsa, efsaFromDrinksL: drinks(efsa) };
}

export const LITERS_PER_US_CUP = 0.2366;
export const ML_PER_US_FL_OZ = 29.5735;
