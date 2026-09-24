"use client";

import { useMemo } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formHeightCm } from "@/lib/calculators/form";
import { idealWeights } from "@/lib/calculators/body";
import { validateProfile } from "@/lib/calculators/protein";
import { formatWeight } from "@/lib/calculators/units";

export function IdealWeightCalculator({ preset, idPrefix = "ibw" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const result = useMemo(() => {
    const heightCm = formHeightCm(form);
    const { height } = validateProfile({ age: 30, weightKg: 70, heightCm });
    if (height) return { ok: false as const, errors: { height } };
    return { ok: true as const, w: idealWeights({ sex: form.sex, heightCm }) };
  }, [form]);
  const f = (kg: number) => formatWeight(kg, form.units);

  return (
    <CalcLayout
      form={<PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity bodyShow="height" />}
    >
      {result.ok ? (
        <>
          <ResultHero label="Healthy weight range for your height (BMI 18.5–24.9)" value={`${f(result.w.bmiRange.min)} – ${f(result.w.bmiRange.max)}`}>
            <p>This is the range most health groups use. It’s a wide range because healthy bodies come in many shapes.</p>
          </ResultHero>
          <ResultTable
            caption="Classic “ideal weight” formulas"
            head={["Formula", "Result"]}
            rows={[
              { label: "Devine (1974)", value: f(result.w.devine) },
              { label: "Robinson (1983)", value: f(result.w.robinson) },
              { label: "Miller (1983)", value: f(result.w.miller) },
              { label: "Hamwi (1964)", value: f(result.w.hamwi) },
            ]}
          />
          <p className="text-xs text-muted">
            These formulas were made to help doctors dose medicines, not to set a goal weight. They don’t account for muscle,
            frame size, or age.
            {result.w.shorterThan5ft && " They are designed for people 5 ft (152 cm) or taller."}
          </p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
