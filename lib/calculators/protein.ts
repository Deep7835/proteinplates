import type { ActivityLevel } from "@/lib/config/calories";
import {
  OLDER_ADULT_AGE,
  OLDER_ADULT_MIN_G_PER_KG,
  PROTEIN_G_PER_KG,
  REFERENCE_BMI,
  REFERENCE_WEIGHT_BMI_THRESHOLD,
  ROUND_DAILY_TARGET_TO_G,
  type Goal,
  type GramsPerKgRange,
} from "@/lib/config/protein";
import { bmi, weightAtBmi } from "./bmi";
import { macroSplit, type MacroSplit } from "./macros";
import { bmrMifflinStJeor, goalCalories, roundTo, tdee, type Sex } from "./tdee";

export type MealsPerDay = 3 | 4;

/** Everything in metric. Convert with units.ts first. */
export type ProfileInput = {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
  mealsPerDay: MealsPerDay;
};

export const LIMITS = {
  age: { min: 18, max: 100 },
  weightKg: { min: 35, max: 320 },
  heightCm: { min: 120, max: 230 },
} as const;

export type ProfileErrors = Partial<Record<"age" | "weight" | "height", string>>;

export function validateProfile(p: Pick<ProfileInput, "age" | "weightKg" | "heightCm">): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!Number.isFinite(p.age) || p.age < LIMITS.age.min || p.age > LIMITS.age.max)
    errors.age = `Enter an age from ${LIMITS.age.min} to ${LIMITS.age.max}.`;
  if (!Number.isFinite(p.weightKg) || p.weightKg < LIMITS.weightKg.min || p.weightKg > LIMITS.weightKg.max)
    errors.weight = "Enter a weight between 77 lb (35 kg) and 705 lb (320 kg).";
  if (!Number.isFinite(p.heightCm) || p.heightCm < LIMITS.heightCm.min || p.heightCm > LIMITS.heightCm.max)
    errors.height = "Enter a height between 3 ft 11 in (120 cm) and 7 ft 6 in (230 cm).";
  return errors;
}

/** g/kg range for a goal, with the 50+ minimum applied. */
export function gramsPerKgFor(goal: Goal, age: number): GramsPerKgRange {
  const base = PROTEIN_G_PER_KG[goal];
  if (age < OLDER_ADULT_AGE) return { ...base };
  const min = Math.max(base.min, OLDER_ADULT_MIN_G_PER_KG);
  return { min, max: Math.max(base.max, min) };
}

/** Weight used for protein math: actual weight, or the weight at REFERENCE_BMI when BMI is above the threshold. */
export function referenceWeightKg(weightKg: number, heightCm: number): { kg: number; adjusted: boolean } {
  if (bmi(weightKg, heightCm) > REFERENCE_WEIGHT_BMI_THRESHOLD) {
    return { kg: weightAtBmi(REFERENCE_BMI, heightCm), adjusted: true };
  }
  return { kg: weightKg, adjusted: false };
}

export type ProteinPlan = {
  bmi: number;
  referenceWeightKg: number;
  usedReferenceWeight: boolean;
  gramsPerKg: GramsPerKgRange;
  proteinG: { min: number; max: number; mid: number };
  perMealG: { min: number; max: number };
  calories: { bmr: number; maintenance: number; target: number; floorApplied: boolean };
  macros: MacroSplit;
};

export function calculateProteinPlan(p: ProfileInput): ProteinPlan {
  const ref = referenceWeightKg(p.weightKg, p.heightCm);
  const gramsPerKg = gramsPerKgFor(p.goal, p.age);

  const step = ROUND_DAILY_TARGET_TO_G;
  const min = roundTo(ref.kg * gramsPerKg.min, step);
  const max = Math.max(roundTo(ref.kg * gramsPerKg.max, step), min + step);
  const mid = roundTo((min + max) / 2, step);

  const bmr = bmrMifflinStJeor(p);
  const maintenance = tdee(bmr, p.activity);
  const cal = goalCalories(maintenance, p.goal, p.sex);

  return {
    bmi: Math.round(bmi(p.weightKg, p.heightCm) * 10) / 10,
    referenceWeightKg: Math.round(ref.kg * 10) / 10,
    usedReferenceWeight: ref.adjusted,
    gramsPerKg,
    proteinG: { min, max, mid },
    perMealG: { min: Math.round(min / p.mealsPerDay), max: Math.round(max / p.mealsPerDay) },
    calories: { bmr: Math.round(bmr), maintenance: roundTo(maintenance, 10), target: cal.target, floorApplied: cal.floorApplied },
    macros: macroSplit({ calories: cal.target, proteinG: mid }),
  };
}
