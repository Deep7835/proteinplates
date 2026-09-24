// Unit conversion. Everything is converted to kg / cm before any math happens.

export type UnitSystem = "us" | "uk" | "metric";
export const UNIT_SYSTEMS: UnitSystem[] = ["us", "uk", "metric"];

export const KG_PER_LB = 0.45359237;
export const LB_PER_STONE = 14;
export const CM_PER_INCH = 2.54;

export type Measurements =
  | { units: "us"; lb: number; ft: number; in: number }
  | { units: "uk"; st: number; lb: number; ft: number; in: number }
  | { units: "metric"; kg: number; cm: number };

export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const ftInToCm = (ft: number, inches: number) => (ft * 12 + inches) * CM_PER_INCH;

export function toKg(m: Measurements): number {
  switch (m.units) {
    case "us":
      return lbToKg(m.lb);
    case "uk":
      return lbToKg(m.st * LB_PER_STONE + m.lb);
    case "metric":
      return m.kg;
  }
}

export function toCm(m: Measurements): number {
  return m.units === "metric" ? m.cm : ftInToCm(m.ft, m.in);
}

/** Friendly weight string in the user's own units, e.g. "150 lb", "10 st 10 lb", "68 kg". */
export function formatWeight(kg: number, units: UnitSystem): string {
  if (units === "metric") return `${Math.round(kg)} kg`;
  const totalLb = Math.round(kgToLb(kg));
  if (units === "us") return `${totalLb} lb`;
  const st = Math.floor(totalLb / LB_PER_STONE);
  const lb = totalLb - st * LB_PER_STONE;
  return lb === 0 ? `${st} st` : `${st} st ${lb} lb`;
}
