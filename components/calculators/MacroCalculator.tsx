"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { MACRO_STYLES, type MacroStyle } from "@/lib/config/calories";
import { GOALS, GOAL_LABELS, type Goal } from "@/lib/config/protein";
import { DEFAULT_FORM, formToProfile, type ProteinFormState } from "@/lib/calculators/form";
import { calculateMacroPlan } from "@/lib/calculators/macroPlan";
import { PersonFields } from "./fields/PersonFields";
import { RadioGroup } from "./fields/RadioGroup";
import { SelectField } from "./fields/SelectField";
import { MacroBar } from "./MacroBar";
import { presetBody, type CalcPreset } from "./presets";
import { useBodyForm } from "./useBodyForm";

type MacroForm = ProteinFormState & { style: MacroStyle };

const fmt = (n: number) => n.toLocaleString("en-US");

export function MacroCalculator({ idPrefix = "macro", preset }: { idPrefix?: string; preset?: CalcPreset }) {
  const { form, set, setUnits } = useBodyForm<MacroForm>({ ...DEFAULT_FORM, ...presetBody(preset), goal: preset?.goal ?? "maintain", style: "balanced" });

  const result = useMemo(() => {
    const r = formToProfile(form);
    return r.ok ? { ok: true as const, plan: calculateMacroPlan(r.profile, form.style) } : r;
  }, [form]);
  const errors = result.ok ? {} : result.errors;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <Card className="space-y-5">
        <h2 className="text-xl">Your details</h2>
        <PersonFields idPrefix={idPrefix} form={form} errors={errors} onChange={set} onUnitsChange={setUnits} />
        <SelectField<Goal>
          id={`${idPrefix}-goal`}
          label="Your goal"
          value={form.goal}
          options={GOALS.map((g) => ({ value: g, label: GOAL_LABELS[g] }))}
          onChange={(goal) => set({ goal })}
        />
        <SelectField<MacroStyle>
          id={`${idPrefix}-style`}
          label="Eating style"
          value={form.style}
          options={MACRO_STYLES.map((s) => ({ value: s.id, label: s.label }))}
          onChange={(style) => set({ style })}
          hint="Protein stays the same. Only the fat and carb split changes."
        />
        <RadioGroup
          legend="Meals a day"
          name={`${idPrefix}-meals`}
          value={String(form.meals) as "3" | "4"}
          options={[
            { value: "3", label: "3 meals" },
            { value: "4", label: "4 meals" },
          ]}
          onChange={(m) => set({ meals: m === "4" ? 4 : 3 })}
        />
      </Card>

      <div className="space-y-5">
        {result.ok ? (
          <>
            <Card className="border-brand-200 bg-brand-50">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">Your daily calories</h2>
              <p aria-live="polite" className="mt-1 text-4xl font-bold tabular-nums text-brand-900 sm:text-5xl">
                {fmt(result.plan.calories)}
              </p>
              <p className="mt-2 text-sm text-brand-900">
                Maintenance is about {fmt(result.plan.maintenance)} calories.
                {result.plan.floorApplied && " We raised your target to a safe minimum."}
              </p>
              <div className="mt-4">
                <MacroBar macros={result.plan.macros} />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg">Your macros in grams</h3>
              <table className="mt-3 w-full text-sm">
                <caption className="sr-only">Daily and per-meal macros in grams</caption>
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th scope="col" className="py-2 font-medium">Macro</th>
                    <th scope="col" className="py-2 text-right font-medium">Per day</th>
                    <th scope="col" className="py-2 text-right font-medium">Per meal ({form.meals})</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {(["protein", "carbs", "fat"] as const).map((k) => (
                    <tr key={k} className="border-b border-line last:border-0">
                      <th scope="row" className="py-2 text-left font-normal capitalize">{k}</th>
                      <td className="py-2 text-right font-semibold">{result.plan.macros[k].grams} g</td>
                      <td className="py-2 text-right">{result.plan.perMeal[k]} g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-muted">
                Protein uses the middle of your {result.plan.proteinRangeG.min}–{result.plan.proteinRangeG.max} g range from
                our <Link href="/protein-calculator">protein calculator</Link>.
                {result.plan.macros.carbsClamped && " Your protein and fat already use all your calories, so carbs are set to 0."}
              </p>
            </Card>
          </>
        ) : (
          <Card>
            <p className="font-medium">Check the highlighted fields to see your results.</p>
          </Card>
        )}
        <Disclaimer />
      </div>
    </div>
  );
}
