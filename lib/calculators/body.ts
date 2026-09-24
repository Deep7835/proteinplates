import { ACE_BODY_FAT, FFMI, WHO_WAIST, WHTR } from "@/lib/config/guidelines";
import { HEALTHY_BMI, weightAtBmi } from "./bmi";
import type { Sex } from "./tdee";
import { CM_PER_INCH } from "./units";

const log10 = Math.log10;
const toIn = (cm: number) => cm / CM_PER_INCH;

/**
 * U.S. Navy / DoD circumference method (DoD Instruction 1308.3, 2002, Enclosure 3; Hodgdon & Beckett 1984).
 * Men use abdomen (waist) and neck; women also use hips. Returns null if the measurements don't make sense.
 */
export function navyBodyFat(input: { sex: Sex; heightCm: number; neckCm: number; waistCm: number; hipCm?: number }): number | null {
  const h = toIn(input.heightCm);
  const neck = toIn(input.neckCm);
  const waist = toIn(input.waistCm);
  if (input.sex === "male") {
    if (waist - neck <= 0) return null;
    return round1(86.01 * log10(waist - neck) - 70.041 * log10(h) + 36.76);
  }
  if (input.hipCm === undefined) return null;
  const hip = toIn(input.hipCm);
  if (waist + hip - neck <= 0) return null;
  return round1(163.205 * log10(waist + hip - neck) - 97.684 * log10(h) - 78.387);
}

export type BodyFatBand = "very-low" | "below-average" | "average" | "obesity";

/**
 * Bands from the ACE ranges we could verify: average (e.g. 25–31% for women) runs up to the obesity
 * line (32%), so decimals like 31.5% count as average. Below 14% / 6% is flagged as very low.
 */
export function bodyFatBand(pct: number, sex: Sex): BodyFatBand {
  const b = ACE_BODY_FAT[sex];
  if (pct < b.veryLowBelow) return "very-low";
  if (pct < b.averageMin) return "below-average";
  if (pct < b.obesityFrom) return "average";
  return "obesity";
}

/** Lean body mass estimates (kg). Boer 1984 (PMID 6496691) and Hume 1966 (PMID 5929341). */
export function leanBodyMass(input: { sex: Sex; weightKg: number; heightCm: number; bodyFatPct?: number | null }) {
  const { sex, weightKg: w, heightCm: h } = input;
  const boer = sex === "male" ? 0.407 * w + 0.267 * h - 19.2 : 0.252 * w + 0.473 * h - 48.3;
  const hume = sex === "male" ? 0.3281 * w + 0.33929 * h - 29.5336 : 0.29569 * w + 0.41813 * h - 43.2933;
  const fromBodyFat = input.bodyFatPct != null ? w * (1 - input.bodyFatPct / 100) : null;
  return { boer: round1(boer), hume: round1(hume), fromBodyFat: fromBodyFat === null ? null : round1(fromBodyFat) };
}

/** Fat-free mass index (Kouri et al. 1995, PMID 7496846). */
export function ffmi(input: { weightKg: number; heightCm: number; bodyFatPct: number }) {
  const m = input.heightCm / 100;
  const ffm = input.weightKg * (1 - input.bodyFatPct / 100);
  const value = ffm / (m * m);
  const normalized = value + FFMI.normalizeFactor * (FFMI.referenceHeightM - m);
  return { fatFreeMassKg: round1(ffm), ffmi: round1(value), normalized: round1(normalized) };
}

/** Ideal body weight formulas (kg), per inch over 5 feet. Built for drug dosing, not as health goals. */
export function idealWeights(input: { sex: Sex; heightCm: number }) {
  const inchesOver5ft = Math.max(0, toIn(input.heightCm) - 60);
  const f = (base: number, perInch: number) => round1(base + perInch * inchesOver5ft);
  const male = input.sex === "male";
  return {
    devine: male ? f(50, 2.3) : f(45.5, 2.3),
    robinson: male ? f(52, 1.9) : f(49, 1.7),
    miller: male ? f(56.2, 1.41) : f(53.1, 1.36),
    hamwi: male ? f(48, 2.7) : f(45.5, 2.2),
    bmiRange: { min: round1(weightAtBmi(HEALTHY_BMI.min, input.heightCm)), max: round1(weightAtBmi(HEALTHY_BMI.max, input.heightCm)) },
    shorterThan5ft: toIn(input.heightCm) < 60,
  };
}

export type WhtrBand = "healthy" | "increased" | "high";

/** NICE NG246 waist-to-height ratio bands. */
export function waistToHeight(waistCm: number, heightCm: number): { ratio: number; band: WhtrBand } {
  const ratio = Math.round((waistCm / heightCm) * 100) / 100;
  const band: WhtrBand = ratio >= WHTR.highFrom ? "high" : ratio >= WHTR.increasedFrom ? "increased" : "healthy";
  return { ratio, band };
}

/** WHO waist-hip ratio and waist circumference risk (2008 expert consultation, Table A1). */
export function waistToHip(input: { sex: Sex; waistCm: number; hipCm: number }) {
  const w = WHO_WAIST[input.sex];
  const ratio = Math.round((input.waistCm / input.hipCm) * 100) / 100;
  const waistRisk =
    input.waistCm > w.waistSubstantialAboveCm ? "substantially-increased" : input.waistCm > w.waistIncreasedAboveCm ? "increased" : "not-increased";
  return { ratio, substantiallyIncreased: ratio >= w.whrSubstantialFrom, cutoff: w.whrSubstantialFrom, waistRisk } as const;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
