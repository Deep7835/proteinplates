import { FAT_SHARE_OF_CALORIES, KCAL_PER_GRAM } from "@/lib/config/calories";

export type MacroPart = { grams: number; kcal: number; percent: number };
export type MacroSplit = { protein: MacroPart; carbs: MacroPart; fat: MacroPart; carbsClamped: boolean };

/**
 * Protein first, then fat as a fixed share of calories, then carbs fill the rest.
 * If protein + fat already exceed the calories, carbs are set to 0 (carbsClamped = true).
 */
export function macroSplit(input: { calories: number; proteinG: number; fatShare?: number }): MacroSplit {
  const { calories, proteinG } = input;
  const fatShare = input.fatShare ?? FAT_SHARE_OF_CALORIES;

  const proteinKcal = proteinG * KCAL_PER_GRAM.protein;
  const fatKcal = calories * fatShare;
  const carbsKcalRaw = calories - proteinKcal - fatKcal;
  const carbsClamped = carbsKcalRaw < 0;
  const carbsKcal = Math.max(0, carbsKcalRaw);

  const total = proteinKcal + fatKcal + carbsKcal;
  const part = (kcal: number, perGram: number): MacroPart => ({
    grams: Math.round(kcal / perGram),
    kcal: Math.round(kcal),
    percent: total > 0 ? Math.round((kcal / total) * 100) : 0,
  });

  return {
    protein: part(proteinKcal, KCAL_PER_GRAM.protein),
    carbs: part(carbsKcal, KCAL_PER_GRAM.carbs),
    fat: part(fatKcal, KCAL_PER_GRAM.fat),
    carbsClamped,
  };
}
