import type { ActivityLevel } from "@/lib/config/calories";
import type { Goal } from "@/lib/config/protein";
import type { Sex } from "@/lib/calculators/tdee";
import type { UnitSystem } from "@/lib/calculators/units";
import { DEFAULT_BODY, type BodyFormState } from "@/lib/calculators/form";

/** Settings a landing page can preselect (e.g. "protein calculator for women" → sex: female). */
export type CalcPreset = { sex?: Sex; goal?: Goal; units?: UnitSystem; activity?: ActivityLevel; age?: number };

/** Default body form with a preset applied. Unit presets keep the default body size, converted. */
export function presetBody(preset?: CalcPreset): BodyFormState {
  const base: BodyFormState = { ...DEFAULT_BODY };
  if (preset?.sex) {
    base.sex = preset.sex;
    if (preset.sex === "male") Object.assign(base, { weight: "180", height: "5", height2: "10" });
  }
  if (preset?.age) base.age = String(preset.age);
  if (preset?.activity) base.activity = preset.activity;
  if (preset?.units === "metric") {
    Object.assign(base, base.sex === "male" ? { weight: "82", height: "178", height2: "" } : { weight: "66", height: "165", height2: "" });
    base.units = "metric";
  } else if (preset?.units === "uk") {
    Object.assign(base, base.sex === "male" ? { weight: "12", weight2: "12" } : { weight: "10", weight2: "5" });
    base.units = "uk";
  }
  return base;
}
