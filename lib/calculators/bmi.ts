// Body Mass Index helpers. BMI = kg / m².

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/** Weight (kg) that gives a chosen BMI at this height. */
export function weightAtBmi(targetBmi: number, heightCm: number): number {
  const m = heightCm / 100;
  return targetBmi * m * m;
}

export type BmiCategory = "underweight" | "healthy" | "overweight" | "obesity";

// Adult cut-offs (CDC, ages 20+: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html).
export function bmiCategory(value: number): BmiCategory {
  if (value < 18.5) return "underweight";
  if (value < 25) return "healthy";
  if (value < 30) return "overweight";
  return "obesity";
}

export const HEALTHY_BMI = { min: 18.5, max: 24.9 } as const;

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  /** Weight range (kg) for a BMI of 18.5–24.9 at this height. */
  healthyRangeKg: { min: number; max: number };
};

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const value = Math.round(bmi(weightKg, heightCm) * 10) / 10;
  return {
    bmi: value,
    category: bmiCategory(value),
    healthyRangeKg: { min: weightAtBmi(HEALTHY_BMI.min, heightCm), max: weightAtBmi(HEALTHY_BMI.max, heightCm) },
  };
}
