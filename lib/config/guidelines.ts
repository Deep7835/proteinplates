// Guideline numbers used by the calculators. Every value cites its source (all checked 2026-09-24).
// Change a number here and every calculator that uses it updates.

/** CDC: losing "about 1 to 2 pounds a week" is more likely to last. https://www.cdc.gov/healthy-weight-growth/losing-weight/ */
export const SAFE_LOSS_LB_PER_WEEK = { min: 1, max: 2 } as const;

/**
 * Rough rule of thumb: about 3,500 kcal per pound (7,700 kcal per kg) of body weight.
 * It overestimates long-term loss because the body adapts (Hall KD et al., Lancet 2011, PMID 21872751),
 * so results are shown as estimates. NIH Body Weight Planner uses a dynamic model: https://www.niddk.nih.gov/bwp
 */
export const KCAL_PER_LB = 3500;
export const KCAL_PER_KG = 7700;

/** ACE body fat bands (acefitness.org). Only the verified bands are used. */
export const ACE_BODY_FAT = {
  female: { veryLowBelow: 14, averageMin: 25, averageMax: 31, obesityFrom: 32 },
  male: { veryLowBelow: 6, averageMin: 18, averageMax: 24, obesityFrom: 25 },
} as const;

/** NICE NG246 (2025): waist-to-height ratio bands for adults. */
export const WHTR = { increasedFrom: 0.5, highFrom: 0.6 } as const;

/** WHO Expert Consultation on Waist Circumference and Waist-Hip Ratio (2008), Table A1. */
export const WHO_WAIST = {
  male: { whrSubstantialFrom: 0.9, waistIncreasedAboveCm: 94, waistSubstantialAboveCm: 102 },
  female: { whrSubstantialFrom: 0.85, waistIncreasedAboveCm: 80, waistSubstantialAboveCm: 88 },
} as const;

/** Institute of Medicine DRI (2005), https://doi.org/10.17226/10490 */
export const FIBER = {
  gramsPer1000Kcal: 14,
  adequateIntake: { male: { upTo50: 38, over50: 30 }, female: { upTo50: 25, over50: 21 } },
} as const;
export const CARBS = { rdaGrams: 130, amdrPct: { min: 45, max: 65 } } as const;

/** Harvard T.H. Chan Nutrition Source: keto usually under 50 g carbs a day, as low as 20 g. */
export const KETO = { carbOptions: [20, 30, 50] as const };

/** WHO 2015 free sugars guideline; AHA scientific statement (Johnson RK et al., Circulation 2009, PMID 19704096). */
export const SUGAR = {
  whoMaxPct: 10,
  whoIdealPct: 5,
  /** WHO: below 5% is "roughly 25 grams (6 teaspoons) per day". */
  whoIdealGramsExample: 25,
  /** AHA limits for added sugars: women 100 kcal (25 g, 6 tsp), men 150 kcal (36 g, 9 tsp), as AHA publishes them. */
  aha: { female: { kcal: 100, grams: 25, teaspoons: 6 }, male: { kcal: 150, grams: 36, teaspoons: 9 } },
  kcalPerGram: 4,
} as const;

/**
 * Water: National Academies DRI (2005, https://doi.org/10.17226/10925) adequate intake of TOTAL water
 * 3.7 L men / 2.7 L women, about 20% from food. EFSA (2010): 2.5 L men / 2.0 L women total water.
 */
export const WATER = {
  nasemTotalL: { male: 3.7, female: 2.7 },
  efsaTotalL: { male: 2.5, female: 2.0 },
  shareFromFood: 0.2,
} as const;

/** CDC: a 5% weight loss can lower the risk of some chronic diseases. */
export const WEIGHT_LOSS_MILESTONES_PCT = [5, 10, 15] as const;

/** Kouri EM et al., Clin J Sport Med 1995 (PMID 7496846): normalized FFMI adds 6.3 × (1.80 m − height). */
export const FFMI = { normalizeFactor: 6.3, referenceHeightM: 1.8, naturalLimitNormalized: 25 } as const;
