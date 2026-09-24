"use client";

import { useMemo } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formToBody } from "@/lib/calculators/form";
import { calorieTargets } from "@/lib/calculators/energy";
import { calculateTdee } from "@/lib/calculators/tdee";

const fmt = (n: number) => n.toLocaleString("en-US");

export function CalorieCalculator({ preset, idPrefix = "cal" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const result = useMemo(() => {
    const r = formToBody(form);
    if (!r.ok) return r;
    const t = calculateTdee(r.body);
    return { ok: true as const, maintenance: t.maintenance, bmr: t.bmr, loseFat: t.goals.lose, targets: calorieTargets(t.maintenance, r.body.sex) };
  }, [form]);
  const errors = result.ok ? {} : result.errors;

  return (
    <CalcLayout form={<PersonFields idPrefix={idPrefix} form={form} errors={errors} onChange={set} onUnitsChange={setUnits} />}>
      {result.ok ? (
        <>
          <ResultHero label="Calories to maintain your weight" value={fmt(result.maintenance)} unit="calories a day">
            <p>Your body burns about {fmt(result.bmr)} calories a day at rest. Your activity adds the rest.</p>
          </ResultHero>
          <ResultTable
            caption="Daily calories for your goal"
            head={["Goal", "Calories a day"]}
            rows={[
              {
                label: "Lose fat (20% below maintenance, our default)",
                value: `${fmt(result.loseFat.target)}${result.loseFat.floorApplied ? " *" : ""}`,
              },
              ...result.targets.map((t) => ({
                label: t.label,
                value: `${fmt(t.calories)}${t.floorApplied ? " *" : ""}`,
                highlight: t.kgPerWeek === 0,
              })),
            ]}
          />
          <p className="text-xs text-muted">
            Uses the rough rule that 1 lb (0.45 kg) of body weight is about 3,500 calories. Real weight loss usually slows
            over time as your body adapts.
            {(result.loseFat.floorApplied || result.targets.some((t) => t.floorApplied)) && " * Raised to a safe minimum."}
          </p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
