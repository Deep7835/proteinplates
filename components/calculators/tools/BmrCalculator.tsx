"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { FieldError } from "../fields/FieldError";
import { NumberInput } from "../fields/NumberInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formToBody, positive } from "@/lib/calculators/form";
import { bmrHarrisBenedict, bmrKatchMcArdle } from "@/lib/calculators/energy";
import { bmrMifflinStJeor } from "@/lib/calculators/tdee";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export function BmrCalculator({ preset, idPrefix = "bmr" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const [bodyFat, setBodyFat] = useState("");

  const result = useMemo(() => {
    const r = formToBody(form);
    if (!r.ok) return r;
    const bf = bodyFat.trim() === "" ? null : positive(bodyFat, 70);
    if (bodyFat.trim() !== "" && bf === null) return { ok: false as const, errors: {}, bfError: "Enter a body fat % from 1 to 70, or leave it blank." };
    return {
      ok: true as const,
      mifflin: bmrMifflinStJeor(r.body),
      harris: bmrHarrisBenedict(r.body),
      katch: bf === null ? null : bmrKatchMcArdle(r.body.weightKg * (1 - bf / 100)),
    };
  }, [form, bodyFat]);

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideActivity />
          <div>
            <NumberInput id={`${idPrefix}-bf`} label="Body fat % (optional)" suffix="%" value={bodyFat} onChange={setBodyFat} describedBy={`${idPrefix}-bf-hint ${idPrefix}-bf-error`} />
            <p id={`${idPrefix}-bf-hint`} className="mt-1 text-xs text-muted">Add it to also see the Katch-McArdle result.</p>
            <FieldError id={`${idPrefix}-bf-error`} message={!result.ok && "bfError" in result ? result.bfError : undefined} />
          </div>
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Your BMR (Mifflin-St Jeor)" value={fmt(result.mifflin)} unit="calories a day">
            <p>This is roughly what your body burns at complete rest. Your daily total (TDEE) is higher because you move.</p>
          </ResultHero>
          <ResultTable
            caption="BMR by formula"
            head={["Formula", "Calories a day"]}
            rows={[
              { label: "Mifflin-St Jeor (1990)", value: fmt(result.mifflin), highlight: true },
              { label: "Harris-Benedict, revised (1984)", value: fmt(result.harris) },
              { label: "Katch-McArdle (uses lean mass)", value: result.katch === null ? "Add body fat %" : fmt(result.katch) },
            ]}
          />
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
