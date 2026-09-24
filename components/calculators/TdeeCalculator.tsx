"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { LinkButton } from "@/components/ui/Button";
import { GOAL_CALORIE_ADJUSTMENT } from "@/lib/config/calories";
import { formToBody } from "@/lib/calculators/form";
import { calculateTdee } from "@/lib/calculators/tdee";
import { PersonFields } from "./fields/PersonFields";
import { ResultStat } from "./ResultStat";
import { presetBody, type CalcPreset } from "./presets";
import { useBodyForm } from "./useBodyForm";

const fmt = (n: number) => n.toLocaleString("en-US");
const pct = (n: number) => `${n > 0 ? "+" : "−"}${Math.abs(Math.round(n * 100))}%`;

export function TdeeCalculator({ idPrefix = "tdee", preset }: { idPrefix?: string; preset?: CalcPreset }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));

  const result = useMemo(() => {
    const r = formToBody(form);
    return r.ok ? { ok: true as const, tdee: calculateTdee(r.body) } : r;
  }, [form]);
  const errors = result.ok ? {} : result.errors;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <Card className="space-y-5">
        <h2 className="text-xl">Your details</h2>
        <PersonFields idPrefix={idPrefix} form={form} errors={errors} onChange={set} onUnitsChange={setUnits} />
      </Card>

      <div className="space-y-5">
        {result.ok ? (
          <>
            <Card className="border-brand-200 bg-brand-50">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">Your maintenance calories (TDEE)</h2>
              <p aria-live="polite" className="mt-1 text-4xl font-bold tabular-nums text-brand-900 sm:text-5xl">
                {fmt(result.tdee.maintenance)} <span className="text-lg font-normal">calories a day</span>
              </p>
              <p className="mt-2 text-sm text-brand-900">
                Your body burns about <strong>{fmt(result.tdee.bmr)}</strong> calories a day at rest (BMR). Your activity
                adds the rest.
              </p>
            </Card>

            <div className="grid gap-5 sm:grid-cols-3">
              <Card>
                <ResultStat label="Lose fat" value={fmt(result.tdee.goals.lose.target)}>
                  {pct(GOAL_CALORIE_ADJUSTMENT.lose)} from maintenance
                  {result.tdee.goals.lose.floorApplied && ", raised to a safe minimum"}
                </ResultStat>
              </Card>
              <Card>
                <ResultStat label="Maintain" value={fmt(result.tdee.goals.maintain.target)}>
                  Keep your weight steady
                </ResultStat>
              </Card>
              <Card>
                <ResultStat label="Build muscle" value={fmt(result.tdee.goals.build.target)}>
                  {pct(GOAL_CALORIE_ADJUSTMENT.build)} from maintenance
                </ResultStat>
              </Card>
            </div>

            <Card>
              <h3 className="text-lg">Calories by activity level</h3>
              <table className="mt-3 w-full text-sm">
                <caption className="sr-only">Maintenance calories at each activity level</caption>
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th scope="col" className="py-2 font-medium">Activity level</th>
                    <th scope="col" className="py-2 text-right font-medium">Calories a day</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tdee.byActivity.map((a) => {
                    const current = a.id === form.activity;
                    return (
                      <tr key={a.id} className={`border-b border-line last:border-0 ${current ? "bg-brand-50 font-semibold" : ""}`}>
                        <th scope="row" className="py-2 text-left font-normal">
                          {a.label}
                          {current && <span className="ml-2 text-xs font-semibold text-brand-700">(you)</span>}
                        </th>
                        <td className="py-2 text-right tabular-nums">{fmt(a.calories)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </>
        ) : (
          <Card>
            <p className="font-medium">Check the highlighted fields to see your results.</p>
          </Card>
        )}

        <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">Now find out how much of those calories should come from protein.</p>
          <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
        </Card>
        <Disclaimer />
      </div>
    </div>
  );
}
