import { CALORIE_FLOOR } from "@/lib/config/calories";
import { KCAL_PER_KG, SAFE_LOSS_LB_PER_WEEK } from "@/lib/config/guidelines";
import { roundTo, type Sex } from "./tdee";
import { KG_PER_LB } from "./units";

type Body = { sex: Sex; age: number; weightKg: number; heightCm: number };

/** Revised Harris-Benedict (Roza & Shizgal, Am J Clin Nutr 1984, PMID 6741850). */
export function bmrHarrisBenedict({ sex, age, weightKg, heightCm }: Body): number {
  return sex === "male"
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

/** Katch-McArdle: needs lean body mass (kg). */
export function bmrKatchMcArdle(leanMassKg: number): number {
  return 370 + 21.6 * leanMassKg;
}

export type WeeklyPlan = { label: string; kgPerWeek: number; calories: number; floorApplied: boolean };

/**
 * Daily calorie targets for common weekly rates, from maintenance calories.
 * Uses the rough 7,700 kcal per kg (3,500 kcal per lb) rule, so results are estimates.
 */
export function calorieTargets(maintenance: number, sex: Sex): WeeklyPlan[] {
  const lb = KG_PER_LB;
  const rates = [
    { label: "Lose 1 lb (0.45 kg) a week", kgPerWeek: -1 * lb },
    { label: "Lose 0.5 lb (0.23 kg) a week", kgPerWeek: -0.5 * lb },
    { label: "Maintain your weight", kgPerWeek: 0 },
    { label: "Gain 0.5 lb (0.23 kg) a week", kgPerWeek: 0.5 * lb },
    { label: "Gain 1 lb (0.45 kg) a week", kgPerWeek: 1 * lb },
  ];
  const floor = CALORIE_FLOOR[sex];
  return rates.map((r) => {
    const raw = maintenance + (r.kgPerWeek * KCAL_PER_KG) / 7;
    const floorApplied = raw < floor;
    return { ...r, calories: roundTo(floorApplied ? floor : raw, 10), floorApplied };
  });
}

export type DeficitPlan = {
  kgToLose: number;
  weeks: number;
  dailyDeficit: number;
  targetCalories: number;
  floorApplied: boolean;
  lbPerWeek: number;
  /** true when the plan asks for more than the CDC's 1–2 lb a week. */
  fasterThanAdvised: boolean;
};

/** Daily deficit needed to reach a goal weight in a number of weeks (rough 7,700 kcal/kg rule). */
export function deficitPlan(input: { sex: Sex; maintenance: number; currentKg: number; goalKg: number; weeks: number }): DeficitPlan | null {
  const kgToLose = input.currentKg - input.goalKg;
  if (kgToLose <= 0 || input.weeks <= 0) return null;
  const dailyDeficit = (kgToLose * KCAL_PER_KG) / (input.weeks * 7);
  const raw = input.maintenance - dailyDeficit;
  const floor = CALORIE_FLOOR[input.sex];
  const lbPerWeek = kgToLose / KG_PER_LB / input.weeks;
  return {
    kgToLose,
    weeks: input.weeks,
    dailyDeficit: roundTo(dailyDeficit, 10),
    targetCalories: roundTo(Math.max(raw, floor), 10),
    floorApplied: raw < floor,
    lbPerWeek: Math.round(lbPerWeek * 10) / 10,
    fasterThanAdvised: lbPerWeek > SAFE_LOSS_LB_PER_WEEK.max,
  };
}

/** Weeks to reach a goal at a steady daily deficit (rough 7,700 kcal/kg rule). */
export function weeksForDeficit(kgToLose: number, dailyDeficit: number): number {
  if (kgToLose <= 0 || dailyDeficit <= 0) return 0;
  return Math.ceil((kgToLose * KCAL_PER_KG) / dailyDeficit / 7);
}
