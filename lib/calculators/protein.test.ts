import { describe, expect, it } from "vitest";
import { PROTEIN_G_PER_KG } from "@/lib/config/protein";
import { buildExampleDays } from "./exampleDays";
import { calculateProteinPlan, gramsPerKgFor, referenceWeightKg, validateProfile, type ProfileInput } from "./protein";
import { lbToKg, toCm, toKg } from "./units";

export const SAMPLE_PROFILES: { name: string; profile: ProfileInput }[] = [
  {
    name: "Male lifter, 25, 180 lb, 5'10\", very active, build muscle, 4 meals",
    profile: { sex: "male", age: 25, weightKg: lbToKg(180), heightCm: toCm({ units: "us", lb: 180, ft: 5, in: 10 }), activity: "active", goal: "build", mealsPerDay: 4 },
  },
  {
    name: "Female on GLP-1, 45, 200 lb, 5'4\", lightly active, 3 meals",
    profile: { sex: "female", age: 45, weightKg: lbToKg(200), heightCm: toCm({ units: "us", lb: 200, ft: 5, in: 4 }), activity: "light", goal: "glp1", mealsPerDay: 3 },
  },
  {
    name: "Male, 68, 80 kg, 175 cm, sedentary, healthy aging, 3 meals",
    profile: { sex: "male", age: 68, weightKg: 80, heightCm: 175, activity: "sedentary", goal: "aging", mealsPerDay: 3 },
  },
  {
    name: "Female, 30, 60 kg, 165 cm, sedentary, maintain, 3 meals",
    profile: { sex: "female", age: 30, weightKg: 60, heightCm: 165, activity: "sedentary", goal: "maintain", mealsPerDay: 3 },
  },
  {
    name: "UK female, 55, 11 st 4 lb, 5'6\", moderately active, lose fat, 3 meals",
    profile: {
      sex: "female",
      age: 55,
      weightKg: toKg({ units: "uk", st: 11, lb: 4, ft: 5, in: 6 }),
      heightCm: toCm({ units: "uk", st: 11, lb: 4, ft: 5, in: 6 }),
      activity: "moderate",
      goal: "lose",
      mealsPerDay: 3,
    },
  },
];

describe("protein plan: hand-checked profiles", () => {
  it("male lifter (BMI 25.8, under 30 → uses actual weight)", () => {
    const plan = calculateProteinPlan(SAMPLE_PROFILES[0].profile);
    // 81.65 kg × 1.6–2.2 g/kg = 130.6–179.6 → rounded 130–180
    expect(plan.usedReferenceWeight).toBe(false);
    expect(plan.proteinG).toEqual({ min: 130, max: 180, mid: 155 });
    expect(plan.perMealG).toEqual({ min: 33, max: 45 });
    // BMR 1807.7 × 1.725 = 3118 → +10% = 3430
    expect(plan.calories.target).toBe(3430);
    expect(plan.macros.protein.grams).toBe(155);
  });

  it("GLP-1 user (BMI 34.3, over 30 → uses weight at BMI 30)", () => {
    const plan = calculateProteinPlan(SAMPLE_PROFILES[1].profile);
    // ref weight = 30 × 1.6256² = 79.28 kg; 1.2–1.6 g/kg → 95.1–126.8 → 95–125
    expect(plan.usedReferenceWeight).toBe(true);
    expect(plan.referenceWeightKg).toBeCloseTo(79.3, 1);
    expect(plan.proteinG).toEqual({ min: 95, max: 125, mid: 110 });
    // BMR 1537.2 × 1.375 = 2113.6 → −15% = 1796.6 → 1800
    expect(plan.calories.target).toBe(1800);
    expect(plan.macros).toMatchObject({ protein: { grams: 110 }, fat: { grams: 60 }, carbs: { grams: 205 } });
  });

  it("has no jump in the target at BMI 30", () => {
    const base = { sex: "male", age: 40, heightCm: 177.8, activity: "light", goal: "maintain", mealsPerDay: 3 } as const;
    const under = calculateProteinPlan({ ...base, weightKg: 94.8 }); // BMI 29.99
    const over = calculateProteinPlan({ ...base, weightKg: 95.3 }); // BMI 30.15
    expect(over.proteinG.min).toBeGreaterThanOrEqual(under.proteinG.min);
  });
});

describe("protein plan: rules", () => {
  it("uses actual weight when BMI is 30 or under", () => {
    expect(referenceWeightKg(60, 165)).toEqual({ kg: 60, adjusted: false });
    expect(referenceWeightKg(81.6, 165)).toEqual({ kg: 81.6, adjusted: false }); // BMI 29.97
    expect(referenceWeightKg(82, 165).adjusted).toBe(true); // BMI 30.1
  });

  it("raises the minimum to 1.0 g/kg at age 50+", () => {
    expect(gramsPerKgFor("maintain", 49)).toEqual(PROTEIN_G_PER_KG.maintain);
    expect(gramsPerKgFor("maintain", 50)).toEqual({ min: 1.0, max: 1.2 });
    expect(gramsPerKgFor("build", 60)).toEqual(PROTEIN_G_PER_KG.build);
  });

  it("rejects out-of-range inputs", () => {
    expect(validateProfile({ age: 15, weightKg: 70, heightCm: 170 })).toHaveProperty("age");
    expect(validateProfile({ age: 30, weightKg: NaN, heightCm: 170 })).toHaveProperty("weight");
    expect(validateProfile({ age: 30, weightKg: 70, heightCm: 300 })).toHaveProperty("height");
    expect(validateProfile({ age: 30, weightKg: 70, heightCm: 170 })).toEqual({});
  });

  it.each(SAMPLE_PROFILES)("$name: consistent results", ({ profile }) => {
    const plan = calculateProteinPlan(profile);
    expect(plan.proteinG.min).toBeLessThan(plan.proteinG.max);
    expect(plan.proteinG.min % 5).toBe(0);
    expect(plan.proteinG.max % 5).toBe(0);
    const g = gramsPerKgFor(profile.goal, profile.age);
    expect(Math.abs(plan.proteinG.min - plan.referenceWeightKg * g.min)).toBeLessThanOrEqual(2.5 + 0.1);
    expect(plan.calories.target % 10).toBe(0);
    const macroKcal = plan.macros.protein.kcal + plan.macros.carbs.kcal + plan.macros.fat.kcal;
    expect(Math.abs(macroKcal - plan.calories.target)).toBeLessThanOrEqual(2);
  });
});

describe("example days", () => {
  it.each(SAMPLE_PROFILES)("$name: every example day inside the protein range", ({ profile }) => {
    const plan = calculateProteinPlan(profile);
    const days = buildExampleDays({ minG: plan.proteinG.min, maxG: plan.proteinG.max }, profile.mealsPerDay);
    expect(days).toHaveLength(4);
    for (const day of days) {
      expect(day.meals).toHaveLength(profile.mealsPerDay);
      expect(day.totalProteinG).toBeGreaterThanOrEqual(plan.proteinG.min);
      expect(day.totalProteinG).toBeLessThanOrEqual(plan.proteinG.max);
    }
  });

  it("stays in range for a very high target (220–300 g, 4 meals)", () => {
    for (const day of buildExampleDays({ minG: 220, maxG: 300 }, 4)) {
      expect(day.totalProteinG).toBeGreaterThanOrEqual(220);
    }
  });

  it("stays in range for a low target (40–60 g, 3 meals)", () => {
    for (const day of buildExampleDays({ minG: 40, maxG: 60 }, 3)) {
      expect(day.totalProteinG).toBeGreaterThanOrEqual(40);
      expect(day.totalProteinG).toBeLessThanOrEqual(60);
    }
  });
});
