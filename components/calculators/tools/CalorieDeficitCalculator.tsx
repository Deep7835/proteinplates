"use client";

import { useMemo, useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { CalcLayout, FixFields, ResultHero } from "../CalcLayout";
import { FieldError } from "../fields/FieldError";
import { NumberInput } from "../fields/NumberInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formToBody, formWeightKg, positive } from "@/lib/calculators/form";
import { deficitPlan } from "@/lib/calculators/energy";
import { calculateTdee } from "@/lib/calculators/tdee";
import { formatWeight, kgToLb, lbToKg, type UnitSystem } from "@/lib/calculators/units";

const fmt = (n: number) => n.toLocaleString("en-US");

export function CalorieDeficitCalculator({ preset, idPrefix = "deficit" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits: setBodyUnits } = useBodyForm(presetBody(preset));
  // Default goal: about 90% of the starting weight, in the chosen units.
  const defaultGoal = (u: UnitSystem, kg: number) => {
    const goalKg = kg * 0.9;
    if (!Number.isFinite(goalKg)) return "";
    if (u === "metric") return String(Math.round(goalKg));
    const lb = kgToLb(goalKg);
    return u === "uk" ? String(Math.round((lb / 14) * 2) / 2) : String(Math.round(lb));
  };
  const [goal, setGoal] = useState(() => defaultGoal(form.units, formWeightKg(form)));
  const setUnits = (u: UnitSystem) => {
    setBodyUnits(u);
    setGoal(defaultGoal(u, formWeightKg(form)));
  };
  const [weeks, setWeeks] = useState("16");

  const result = useMemo(() => {
    const r = formToBody(form);
    if (!r.ok) return { ok: false as const, errors: r.errors, extra: {} as Record<string, string> };
    const g = positive(goal, 1000);
    const w = positive(weeks, 520);
    const goalKg = g === null ? NaN : form.units === "metric" ? g : form.units === "uk" ? lbToKg(g * 14) : lbToKg(g);
    const extra: Record<string, string> = {};
    if (g === null || !(goalKg < r.body.weightKg)) extra.goal = "Enter a goal weight below your current weight.";
    if (w === null) extra.weeks = "Enter a number of weeks.";
    if (Object.keys(extra).length) return { ok: false as const, errors: {}, extra };
    const maintenance = calculateTdee(r.body).maintenance;
    const plan = deficitPlan({ sex: r.body.sex, maintenance, currentKg: r.body.weightKg, goalKg, weeks: w! });
    return plan ? { ok: true as const, plan, maintenance } : { ok: false as const, errors: {}, extra };
  }, [form, goal, weeks]);

  const goalUnit = form.units === "metric" ? "kg" : form.units === "uk" ? "st" : "lb";

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <NumberInput id={`${idPrefix}-goal`} label="Goal weight" suffix={goalUnit} value={goal} onChange={setGoal} invalid={!result.ok && !!result.extra.goal} describedBy={`${idPrefix}-goal-error`} />
              <FieldError id={`${idPrefix}-goal-error`} message={result.ok ? undefined : result.extra.goal} />
            </div>
            <div>
              <NumberInput id={`${idPrefix}-weeks`} label="In how many weeks?" suffix="wks" value={weeks} onChange={setWeeks} invalid={!result.ok && !!result.extra.weeks} describedBy={`${idPrefix}-weeks-error`} />
              <FieldError id={`${idPrefix}-weeks-error`} message={result.ok ? undefined : result.extra.weeks} />
            </div>
          </div>
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Eat about this much each day" value={fmt(result.plan.targetCalories)} unit="calories">
            <p>
              That’s a deficit of about <strong>{fmt(result.plan.dailyDeficit)} calories a day</strong> below your maintenance of{" "}
              {fmt(result.maintenance)}, to lose {formatWeight(result.plan.kgToLose, form.units)} in{" "}
              {result.plan.weeks} weeks (about {result.plan.lbPerWeek} lb a week).
            </p>
          </ResultHero>
          {result.plan.fasterThanAdvised && (
            <Callout tone="warn" title="This is faster than advised">
              The CDC says people who lose about 1 to 2 lb (0.5 to 0.9 kg) a week are more likely to keep it off. Try more
              weeks for a gentler plan.
            </Callout>
          )}
          {result.plan.floorApplied && (
            <Callout tone="warn" title="Raised to a safe minimum">
              The math asked for fewer calories than we ever suggest, so we raised it. You would need more time to reach
              your goal.
            </Callout>
          )}
          <p className="text-xs text-muted">
            An estimate using the rough rule of 3,500 calories per pound (7,700 per kg). Weight loss usually slows over
            time, so expect it to take longer.
          </p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
