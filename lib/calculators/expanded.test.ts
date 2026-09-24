import { describe, expect, it } from "vitest";
import { caloriesBurned } from "./activity";
import { bodyFatBand, ffmi, idealWeights, leanBodyMass, navyBodyFat, waistToHeight, waistToHip } from "./body";
import { bmrHarrisBenedict, bmrKatchMcArdle, calorieTargets, deficitPlan, weeksForDeficit } from "./energy";
import { carbTargets, fiberTargets, ketoMacros, sugarLimits, waterTargets } from "./nutrients";
import { ftInToCm } from "./units";
import { weightLossPercent } from "./weightLoss";

describe("energy", () => {
  it("revised Harris-Benedict matches Roza & Shizgal (1984)", () => {
    expect(bmrHarrisBenedict({ sex: "male", age: 30, weightKg: 70, heightCm: 175 })).toBeCloseTo(1695.667, 2);
    expect(bmrHarrisBenedict({ sex: "female", age: 30, weightKg: 60, heightCm: 165 })).toBeCloseTo(1383.683, 2);
  });
  it("Katch-McArdle", () => expect(bmrKatchMcArdle(60)).toBeCloseTo(1666, 6));
  it("calorie targets for weekly rates, with the floor", () => {
    const t = calorieTargets(2000, "female");
    expect(t.map((x) => x.calories)).toEqual([1500, 1750, 2000, 2250, 2500]);
    expect(calorieTargets(1400, "female")[0]).toMatchObject({ calories: 1200, floorApplied: true });
  });
  it("deficit plan to a goal weight", () => {
    expect(deficitPlan({ sex: "female", maintenance: 2000, currentKg: 80, goalKg: 70, weeks: 20 })).toMatchObject({
      dailyDeficit: 550,
      targetCalories: 1450,
      lbPerWeek: 1.1,
      fasterThanAdvised: false,
      floorApplied: false,
    });
    expect(deficitPlan({ sex: "female", maintenance: 2000, currentKg: 80, goalKg: 70, weeks: 5 })).toMatchObject({
      targetCalories: 1200,
      floorApplied: true,
      fasterThanAdvised: true,
    });
    expect(deficitPlan({ sex: "male", maintenance: 2500, currentKg: 70, goalKg: 75, weeks: 10 })).toBeNull();
    expect(weeksForDeficit(10, 550)).toBe(20);
  });
});

describe("body composition", () => {
  it("Navy body fat (DoD 1308.3 equations)", () => {
    // Man 5'10", neck 15 in, waist 34 in → 17.5%
    expect(navyBodyFat({ sex: "male", heightCm: ftInToCm(5, 10), neckCm: 15 * 2.54, waistCm: 34 * 2.54 })).toBe(17.5);
    // Woman 5'5", neck 13 in, waist 30 in, hips 38 in → 28.6%
    expect(navyBodyFat({ sex: "female", heightCm: ftInToCm(5, 5), neckCm: 13 * 2.54, waistCm: 30 * 2.54, hipCm: 38 * 2.54 })).toBe(28.6);
    expect(navyBodyFat({ sex: "male", heightCm: 180, neckCm: 40, waistCm: 38 })).toBeNull();
  });
  it("ACE-based bands", () => {
    expect(bodyFatBand(28.6, "female")).toBe("average");
    expect(bodyFatBand(33, "female")).toBe("obesity");
    expect(bodyFatBand(5, "male")).toBe("very-low");
    expect(bodyFatBand(15, "male")).toBe("below-average");
    expect(bodyFatBand(31.5, "female")).toBe("average");
  });
  it("lean body mass (Boer, Hume, from body fat)", () => {
    expect(leanBodyMass({ sex: "male", weightKg: 80, heightCm: 180, bodyFatPct: 20 })).toEqual({ boer: 61.4, hume: 57.8, fromBodyFat: 64 });
  });
  it("FFMI with Kouri's 6.3 normalization", () => {
    expect(ffmi({ weightKg: 80, heightCm: 180, bodyFatPct: 15 })).toEqual({ fatFreeMassKg: 68, ffmi: 21, normalized: 21 });
    expect(ffmi({ weightKg: 80, heightCm: 170, bodyFatPct: 15 }).normalized).toBe(24.2);
  });
  it("ideal weight formulas", () => {
    expect(idealWeights({ sex: "male", heightCm: ftInToCm(5, 10) })).toMatchObject({ devine: 73, robinson: 71, miller: 70.3, hamwi: 75 });
    expect(idealWeights({ sex: "female", heightCm: ftInToCm(5, 5) })).toMatchObject({ devine: 57, robinson: 57.5, miller: 59.9, hamwi: 56.5 });
  });
  it("waist-to-height (NICE) and waist-to-hip (WHO)", () => {
    expect(waistToHeight(80, 170)).toEqual({ ratio: 0.47, band: "healthy" });
    expect(waistToHeight(90, 170).band).toBe("increased");
    expect(waistToHeight(105, 170).band).toBe("high");
    expect(waistToHip({ sex: "female", waistCm: 86, hipCm: 100 })).toMatchObject({ ratio: 0.86, substantiallyIncreased: true, waistRisk: "increased" });
    expect(waistToHip({ sex: "male", waistCm: 85, hipCm: 100 })).toMatchObject({ substantiallyIncreased: false, waistRisk: "not-increased" });
  });
});

describe("nutrients", () => {
  it("fiber, carbs, keto, sugar, water", () => {
    expect(fiberTargets({ sex: "female", age: 40, calories: 2000 })).toEqual({ byCalories: 28, adequateIntake: 25 });
    expect(fiberTargets({ sex: "male", age: 60, calories: 2200 }).adequateIntake).toBe(30);
    expect(carbTargets(2000)).toEqual({ min: 225, max: 325, rda: 130 });
    expect(ketoMacros({ calories: 2000, carbsG: 20, proteinG: 100 }).fat).toEqual({ grams: 169, percent: 76 });
    expect(sugarLimits({ sex: "female", calories: 2000 })).toEqual({ whoMax: 50, whoIdeal: 25, aha: { grams: 25, teaspoons: 6 } });
    expect(sugarLimits({ sex: "male", calories: 2500 }).aha).toEqual({ grams: 36, teaspoons: 9 });
    expect(waterTargets("female")).toEqual({ nasemTotalL: 2.7, nasemFromDrinksL: 2.2, efsaTotalL: 2, efsaFromDrinksL: 1.6 });
  });
});

describe("activity and weight loss", () => {
  it("calories burned = MET × kg × hours", () => expect(caloriesBurned({ met: 3.8, weightKg: 70, minutes: 60 })).toBe(266));
  it("weight loss percent and milestones", () => {
    expect(weightLossPercent(200, 180)).toEqual({ lost: 20, percent: 10, reached: [5, 10], next: { percent: 15, weightAt: 170 } });
    expect(weightLossPercent(200, 205).percent).toBe(-2.5);
  });
});
