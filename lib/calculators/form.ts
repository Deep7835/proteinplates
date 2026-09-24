// Calculator form state, conversion to metric, and share-URL (de)serialization.
// Kept separate from React so it can be reused later (e.g. saving a plan server-side).

import { ACTIVITY_IDS, type ActivityLevel } from "@/lib/config/calories";
import { GOALS, type Goal } from "@/lib/config/protein";
import { validateProfile, type MealsPerDay, type ProfileErrors, type ProfileInput } from "./protein";
import type { Sex } from "./tdee";
import { CM_PER_INCH, LB_PER_STONE, UNIT_SYSTEMS, ftInToCm, kgToLb, lbToKg, toCm, toKg, type Measurements, type UnitSystem } from "./units";

/** Raw body inputs shared by all calculators. Numbers are strings so inputs can be empty while typing. */
export type BodyFormState = {
  units: UnitSystem;
  sex: Sex;
  age: string;
  /** lb (us), stone (uk), or kg (metric) */
  weight: string;
  /** extra lb (uk only) */
  weight2: string;
  /** ft (us/uk) or cm (metric) */
  height: string;
  /** extra in (us/uk only) */
  height2: string;
  activity: ActivityLevel;
};

export type ProteinFormState = BodyFormState & {
  goal: Goal;
  meals: MealsPerDay;
};

export const DEFAULT_BODY: BodyFormState = {
  units: "us",
  sex: "female",
  age: "40",
  weight: "145",
  weight2: "",
  height: "5",
  height2: "5",
  activity: "light",
};

export const DEFAULT_FORM: ProteinFormState = { ...DEFAULT_BODY, goal: "maintain", meals: 3 };

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const numOrZero = (s: string) => (s.trim() === "" ? 0 : Number(s));

export function formToMeasurements(f: BodyFormState): Measurements {
  switch (f.units) {
    case "us":
      return { units: "us", lb: num(f.weight), ft: num(f.height), in: numOrZero(f.height2) };
    case "uk":
      return { units: "uk", st: num(f.weight), lb: numOrZero(f.weight2), ft: num(f.height), in: numOrZero(f.height2) };
    case "metric":
      return { units: "metric", kg: num(f.weight), cm: num(f.height) };
  }
}

export type Body = { sex: Sex; age: number; weightKg: number; heightCm: number; activity: ActivityLevel };
export type BodyResult = { ok: true; body: Body } | { ok: false; errors: ProfileErrors };

/** Converts and validates the shared body inputs. */
export function formToBody(f: BodyFormState): BodyResult {
  const m = formToMeasurements(f);
  const weightKg = toKg(m);
  const heightCm = toCm(m);
  const age = num(f.age);
  const errors = validateProfile({ age, weightKg, heightCm });
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, body: { sex: f.sex, age, weightKg, heightCm, activity: f.activity } };
}

export type FormResult = { ok: true; profile: ProfileInput } | { ok: false; errors: ProfileErrors };

export function formToProfile(f: ProteinFormState): FormResult {
  const r = formToBody(f);
  if (!r.ok) return r;
  return { ok: true, profile: { ...r.body, goal: f.goal, mealsPerDay: f.meals } };
}

/** Values change units cleanly when the toggle is switched (e.g. 165 lb → 11 st 11 lb → 75 kg). */
export function convertFormUnits<T extends BodyFormState>(f: T, to: UnitSystem): T {
  if (f.units === to) return f;
  const m = formToMeasurements(f);
  const kg = toKg(m);
  const cm = toCm(m);
  const next: T = { ...f, units: to, weight: "", weight2: "", height: "", height2: "" };
  if (Number.isFinite(kg)) {
    if (to === "metric") next.weight = String(Math.round(kg));
    else {
      const lb = Math.round(kgToLb(kg));
      if (to === "us") next.weight = String(lb);
      else {
        next.weight = String(Math.floor(lb / LB_PER_STONE));
        next.weight2 = String(lb % LB_PER_STONE);
      }
    }
  }
  if (Number.isFinite(cm)) {
    if (to === "metric") next.height = String(Math.round(cm));
    else {
      const totalIn = Math.round(cm / CM_PER_INCH);
      next.height = String(Math.floor(totalIn / 12));
      next.height2 = String(totalIn % 12);
    }
  }
  return next;
}

// Short query keys keep share links tidy. No personal data is stored anywhere; it only lives in the URL.
const SEX_KEYS: Record<Sex, string> = { male: "m", female: "f" };

export function formToSearchParams(f: ProteinFormState): URLSearchParams {
  const p = new URLSearchParams();
  p.set("units", f.units);
  p.set("sex", SEX_KEYS[f.sex]);
  p.set("age", f.age);
  p.set("w", f.weight);
  if (f.units === "uk" && f.weight2) p.set("w2", f.weight2);
  p.set("h", f.height);
  if (f.units !== "metric" && f.height2) p.set("h2", f.height2);
  p.set("act", f.activity);
  p.set("goal", f.goal);
  p.set("meals", String(f.meals));
  return p;
}

const isNumeric = (s: string | null): s is string => s !== null && /^\d{1,3}(\.\d{1,2})?$/.test(s);

/** Reads a share link. Invalid or missing values fall back to `base`. Returns null if no params exist. */
export function formFromSearchParams(params: URLSearchParams, base: ProteinFormState = DEFAULT_FORM): ProteinFormState | null {
  if (![...params.keys()].some((k) => ["units", "sex", "age", "w", "h", "act", "goal", "meals"].includes(k))) return null;
  const units = params.get("units");
  const sex = params.get("sex");
  const act = params.get("act");
  const goal = params.get("goal");
  const meals = params.get("meals");
  const pick = (key: string, fallback: string) => {
    const v = params.get(key);
    return isNumeric(v) ? v : fallback;
  };
  const u = UNIT_SYSTEMS.includes(units as UnitSystem) ? (units as UnitSystem) : base.units;
  const sameUnits = u === base.units;
  return {
    units: u,
    sex: sex === "m" ? "male" : sex === "f" ? "female" : base.sex,
    age: pick("age", base.age),
    weight: pick("w", sameUnits ? base.weight : ""),
    weight2: pick("w2", ""),
    height: pick("h", sameUnits ? base.height : ""),
    height2: pick("h2", ""),
    activity: ACTIVITY_IDS.includes(act as ActivityLevel) ? (act as ActivityLevel) : base.activity,
    goal: GOALS.includes(goal as Goal) ? (goal as Goal) : base.goal,
    meals: meals === "4" ? 4 : meals === "3" ? 3 : base.meals,
  };
}

/** Weight only, in kg (NaN if missing). */
export function formWeightKg(f: BodyFormState): number {
  if (f.units === "metric") return num(f.weight);
  if (f.units === "us") return lbToKg(num(f.weight));
  return lbToKg(num(f.weight) * LB_PER_STONE + numOrZero(f.weight2));
}

/** Height only, in cm (NaN if missing). */
export function formHeightCm(f: BodyFormState): number {
  return f.units === "metric" ? num(f.height) : ftInToCm(num(f.height), numOrZero(f.height2));
}

/** A tape measurement (waist, neck, hips) typed in inches (US/UK) or cm (metric), in cm. */
export function lengthToCm(value: string, units: UnitSystem): number {
  const n = num(value);
  return units === "metric" ? n : n * CM_PER_INCH;
}

/** Plain positive-number check for extra fields. */
export function positive(value: string, max = Infinity): number | null {
  const n = num(value);
  return Number.isFinite(n) && n > 0 && n <= max ? n : null;
}

/** Converts a typed tape measurement when the unit system changes (inches ↔ cm). */
export function convertLength(value: string, from: UnitSystem, to: UnitSystem): string {
  const fromMetric = from === "metric";
  const toMetric = to === "metric";
  if (fromMetric === toMetric || value.trim() === "") return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return String(Math.round((toMetric ? n * CM_PER_INCH : n / CM_PER_INCH) * 10) / 10);
}
