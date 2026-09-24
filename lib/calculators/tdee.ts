import { ACTIVITY_LEVELS, CALORIE_FLOOR, GOAL_CALORIE_ADJUSTMENT, type ActivityLevel } from "@/lib/config/calories";
import type { Goal } from "@/lib/config/protein";

export type Sex = "male" | "female";

/** Mifflin-St Jeor resting energy expenditure, kcal/day (Mifflin et al., 1990). */
export function bmrMifflinStJeor(input: { sex: Sex; age: number; weightKg: number; heightCm: number }): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return input.sex === "male" ? base + 5 : base - 161;
}

export function activityFactor(level: ActivityLevel): number {
  const found = ACTIVITY_LEVELS.find((a) => a.id === level);
  if (!found) throw new Error(`Unknown activity level: ${level}`);
  return found.factor;
}

/** Total daily energy expenditure (maintenance calories). */
export function tdee(bmr: number, level: ActivityLevel): number {
  return bmr * activityFactor(level);
}

export type CalorieTarget = { target: number; floorApplied: boolean };

/** Goal-adjusted daily calories, rounded to 10 kcal, never below the floor for the user's sex. */
export function goalCalories(maintenance: number, goal: Goal, sex: Sex): CalorieTarget {
  const adjusted = maintenance * (1 + GOAL_CALORIE_ADJUSTMENT[goal]);
  const floor = CALORIE_FLOOR[sex];
  const floorApplied = adjusted < floor;
  return { target: roundTo(floorApplied ? floor : adjusted, 10), floorApplied };
}

export type TdeeResult = {
  bmr: number;
  maintenance: number;
  byActivity: { id: ActivityLevel; label: string; calories: number }[];
  goals: { lose: CalorieTarget; maintain: CalorieTarget; build: CalorieTarget };
};

/** Everything the TDEE calculator shows. All calories rounded to 10 kcal. */
export function calculateTdee(input: { sex: Sex; age: number; weightKg: number; heightCm: number; activity: ActivityLevel }): TdeeResult {
  const bmr = bmrMifflinStJeor(input);
  const maintenance = tdee(bmr, input.activity);
  return {
    bmr: roundTo(bmr, 10),
    maintenance: roundTo(maintenance, 10),
    byActivity: ACTIVITY_LEVELS.map((a) => ({ id: a.id, label: a.label, calories: roundTo(bmr * a.factor, 10) })),
    goals: {
      lose: goalCalories(maintenance, "lose", input.sex),
      maintain: goalCalories(maintenance, "maintain", input.sex),
      build: goalCalories(maintenance, "build", input.sex),
    },
  };
}

export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
