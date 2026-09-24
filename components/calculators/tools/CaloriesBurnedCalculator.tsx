"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { NumberInput } from "../fields/NumberInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formWeightKg, positive } from "@/lib/calculators/form";
import { activityById, caloriesBurned } from "@/lib/calculators/activity";
import { validateProfile } from "@/lib/calculators/protein";
import { ACTIVITIES } from "@/lib/config/activities";

const groups = [...new Set(ACTIVITIES.map((a) => a.group))];

export function CaloriesBurnedCalculator({ preset, idPrefix = "burn" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const [activity, setActivity] = useState("walk-moderate");
  const [minutes, setMinutes] = useState("30");

  const result = useMemo(() => {
    const weightKg = formWeightKg(form);
    const { weight } = validateProfile({ age: 30, weightKg, heightCm: 170 });
    const mins = positive(minutes, 1440);
    const a = activityById(activity);
    if (weight || mins === null || !a) return { ok: false as const, errors: { weight } };
    const sameGroup = ACTIVITIES.filter((x) => x.group === a.group);
    return {
      ok: true as const,
      a,
      mins,
      kcal: caloriesBurned({ met: a.met, weightKg, minutes: mins }),
      compare: sameGroup.map((x) => ({ x, kcal: caloriesBurned({ met: x.met, weightKg, minutes: mins }) })),
    };
  }, [form, activity, minutes]);

  return (
    <CalcLayout
      disclaimer={false}
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity hideSex bodyShow="weight" />
          <div>
            <label htmlFor={`${idPrefix}-activity`} className="mb-1.5 block text-sm font-medium">
              Activity
            </label>
            <select
              id={`${idPrefix}-activity`}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-page px-3 text-base"
            >
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {ACTIVITIES.filter((a) => a.group === g).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <NumberInput id={`${idPrefix}-min`} label="Minutes" suffix="min" value={minutes} onChange={setMinutes} />
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Calories burned" value={result.kcal} unit="calories">
            <p>
              {result.a.label} for {result.mins} minutes (MET {result.a.met}).
            </p>
          </ResultHero>
          <ResultTable
            caption={`${result.a.group}: ${result.mins} minutes`}
            head={["Activity", "Calories"]}
            rows={result.compare.map((c) => ({ label: c.x.label, value: c.kcal, highlight: c.x.id === result.a.id }))}
          />
          <p className="text-xs text-muted">
            Based on MET values from the 2024 Compendium of Physical Activities. Real burn varies with fitness, terrain, and
            effort. This includes the calories your body would burn at rest anyway.
          </p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
