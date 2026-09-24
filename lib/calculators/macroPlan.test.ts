import { describe, expect, it } from "vitest";
import { calculateMacroPlan } from "./macroPlan";
import type { ProfileInput } from "./protein";

const profile: ProfileInput = { sex: "female", age: 30, weightKg: 60, heightCm: 165, activity: "moderate", goal: "lose", mealsPerDay: 3 };

describe("calculateMacroPlan", () => {
  it("uses the protein midpoint and the chosen fat share", () => {
    // Protein: 60 kg × 1.6–2.2 = 96–132 → 95–130, mid 115. Calories: 2046.4 × 0.8 = 1637 → 1640.
    const r = calculateMacroPlan(profile, "balanced");
    expect(r.calories).toBe(1640);
    expect(r.macros.protein.grams).toBe(115);
    expect(r.macros.fat.grams).toBe(55); // 492 kcal / 9
    expect(r.macros.carbs.grams).toBe(172); // (1640 − 460 − 492) / 4
    expect(r.perMeal).toEqual({ protein: 38, carbs: 57, fat: 18 });
  });

  it("changes fat and carbs, not protein, when the style changes", () => {
    const low = calculateMacroPlan(profile, "lower_fat");
    const high = calculateMacroPlan(profile, "higher_fat");
    expect(low.macros.protein.grams).toBe(high.macros.protein.grams);
    expect(low.macros.fat.grams).toBeLessThan(high.macros.fat.grams);
    expect(low.macros.carbs.grams).toBeGreaterThan(high.macros.carbs.grams);
  });
});
