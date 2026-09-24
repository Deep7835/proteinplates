import { describe, expect, it } from "vitest";
import { bmi, bmiCategory, calculateBmi, weightAtBmi } from "./bmi";
import { macroSplit } from "./macros";
import { bmrMifflinStJeor, calculateTdee, goalCalories, tdee } from "./tdee";

describe("Mifflin-St Jeor", () => {
  it("matches the published equation", () => {
    // 10×70 + 6.25×175 − 5×30 + 5 = 1648.75
    expect(bmrMifflinStJeor({ sex: "male", age: 30, weightKg: 70, heightCm: 175 })).toBeCloseTo(1648.75, 6);
    // 10×60 + 6.25×165 − 5×30 − 161 = 1320.25
    expect(bmrMifflinStJeor({ sex: "female", age: 30, weightKg: 60, heightCm: 165 })).toBeCloseTo(1320.25, 6);
  });

  it("applies activity factors", () => {
    expect(tdee(1000, "sedentary")).toBeCloseTo(1200, 6);
    expect(tdee(1000, "very_active")).toBeCloseTo(1900, 6);
  });

  it("never goes below the calorie floor", () => {
    expect(goalCalories(1100, "lose", "female")).toEqual({ target: 1200, floorApplied: true });
    expect(goalCalories(1600, "lose", "male")).toEqual({ target: 1500, floorApplied: true });
    expect(goalCalories(2500, "lose", "male")).toEqual({ target: 2000, floorApplied: false });
  });
});

describe("BMI", () => {
  it("computes BMI and categories", () => {
    expect(bmi(70, 175)).toBeCloseTo(22.86, 2);
    expect(bmiCategory(18.4)).toBe("underweight");
    expect(bmiCategory(24.9)).toBe("healthy");
    expect(bmiCategory(25)).toBe("overweight");
    expect(bmiCategory(30)).toBe("obesity");
    expect(weightAtBmi(25, 180)).toBeCloseTo(81, 6);
  });
});

describe("macro split", () => {
  it("gives protein first, 30% fat, carbs the rest", () => {
    const m = macroSplit({ calories: 2000, proteinG: 150 });
    expect(m.protein).toEqual({ grams: 150, kcal: 600, percent: 30 });
    expect(m.fat).toEqual({ grams: 67, kcal: 600, percent: 30 });
    expect(m.carbs).toEqual({ grams: 200, kcal: 800, percent: 40 });
    expect(m.carbsClamped).toBe(false);
  });

  it("never returns negative carbs", () => {
    const m = macroSplit({ calories: 1200, proteinG: 250 });
    expect(m.carbs.grams).toBe(0);
    expect(m.carbsClamped).toBe(true);
  });
});

describe("calculateTdee", () => {
  it("returns maintenance, goal targets, and every activity level", () => {
    // Female, 30, 60 kg, 165 cm: BMR 1320.25
    const r = calculateTdee({ sex: "female", age: 30, weightKg: 60, heightCm: 165, activity: "moderate" });
    expect(r.bmr).toBe(1320);
    expect(r.maintenance).toBe(2050); // 1320.25 × 1.55 = 2046.4
    expect(r.goals.lose.target).toBe(1640); // −20%
    expect(r.goals.build.target).toBe(2250); // +10%
    expect(r.byActivity.map((a) => a.calories)).toEqual([1580, 1820, 2050, 2280, 2510]);
  });
});

describe("calculateBmi", () => {
  it("returns BMI, category, and the healthy weight range for the height", () => {
    const r = calculateBmi(95, 175);
    expect(r.bmi).toBe(31);
    expect(r.category).toBe("obesity");
    expect(r.healthyRangeKg.min).toBeCloseTo(56.66, 2);
    expect(r.healthyRangeKg.max).toBeCloseTo(76.26, 2);
  });
});
