"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { LinkButton } from "@/components/ui/Button";
import { calculateBmi, type BmiCategory } from "@/lib/calculators/bmi";
import { formToMeasurements } from "@/lib/calculators/form";
import { validateProfile } from "@/lib/calculators/protein";
import { formatWeight, toCm, toKg } from "@/lib/calculators/units";
import { PersonFields } from "./fields/PersonFields";
import { presetBody, type CalcPreset } from "./presets";
import { useBodyForm } from "./useBodyForm";

const CATEGORY_LABELS: Record<BmiCategory, string> = {
  underweight: "Underweight",
  healthy: "Healthy weight",
  overweight: "Overweight",
  obesity: "Obesity",
};

// Scale shown from BMI 15 to 40.
const SCALE = { min: 15, max: 40 };
const BANDS = [
  { to: 18.5, color: "bg-accent-100" },
  { to: 25, color: "bg-brand-200" },
  { to: 30, color: "bg-accent-100" },
  { to: 40, color: "bg-accent-400" },
];
const pos = (v: number) => ((Math.min(Math.max(v, SCALE.min), SCALE.max) - SCALE.min) / (SCALE.max - SCALE.min)) * 100;

export function BmiCalculator({ idPrefix = "bmi", preset }: { idPrefix?: string; preset?: CalcPreset }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));

  const result = useMemo(() => {
    const m = formToMeasurements(form);
    const weightKg = toKg(m);
    const heightCm = toCm(m);
    // Age isn't used for BMI, so only weight and height are checked.
    const { weight, height } = validateProfile({ age: 30, weightKg, heightCm });
    if (weight || height) return { ok: false as const, errors: { weight, height } };
    return { ok: true as const, bmi: calculateBmi(weightKg, heightCm) };
  }, [form]);
  const errors = result.ok ? {} : result.errors;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <Card className="space-y-5">
        <h2 className="text-xl">Your details</h2>
        <PersonFields idPrefix={idPrefix} form={form} errors={errors} onChange={set} onUnitsChange={setUnits} bodyOnly />
      </Card>

      <div className="space-y-5">
        {result.ok ? (
          <Card className="border-brand-200 bg-brand-50">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">Your BMI</h2>
            <p aria-live="polite" className="mt-1 text-4xl font-bold tabular-nums text-brand-900 sm:text-5xl">
              {result.bmi.bmi.toFixed(1)}{" "}
              <span className="text-lg font-semibold">{CATEGORY_LABELS[result.bmi.category]}</span>
            </p>

            <div className="mt-5" aria-hidden>
              <div className="relative flex h-3 overflow-hidden rounded-full">
                {BANDS.map((b, i) => {
                  const from = i === 0 ? SCALE.min : BANDS[i - 1].to;
                  return <div key={b.to} className={b.color} style={{ width: `${pos(b.to) - pos(from)}%` }} />;
                })}
              </div>
              <div className="relative h-4">
                <span
                  className="absolute top-0 -translate-x-1/2 text-xs font-bold text-brand-900"
                  style={{ left: `${pos(result.bmi.bmi)}%` }}
                >
                  ▲
                </span>
              </div>
              <div className="relative h-4 text-xs text-muted">
                {[15, 18.5, 25, 30, 40].map((v, i, all) => (
                  <span
                    key={v}
                    className={`absolute ${i === 0 ? "" : i === all.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
                    style={{ left: `${pos(v)}%` }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-brand-900">
              A healthy BMI range for your height is about{" "}
              <strong>
                {formatWeight(result.bmi.healthyRangeKg.min, form.units)} to{" "}
                {formatWeight(result.bmi.healthyRangeKg.max, form.units)}
              </strong>
              .
            </p>
          </Card>
        ) : (
          <Card>
            <p className="font-medium">Check the highlighted fields to see your results.</p>
          </Card>
        )}

        <Callout title="BMI is only one number">
          BMI can’t tell muscle from fat. It may call a muscular person “overweight.” For adults over 65, a BMI a bit
          above 25 is not linked to a higher risk of death. Talk to your doctor about what a healthy weight is for you.
        </Callout>

        <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">Want to keep muscle while you change your weight? Start with protein.</p>
          <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
        </Card>
      </div>
    </div>
  );
}
