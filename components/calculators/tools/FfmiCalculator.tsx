"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { FieldError } from "../fields/FieldError";
import { NumberInput } from "../fields/NumberInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formHeightCm, formWeightKg, positive } from "@/lib/calculators/form";
import { ffmi } from "@/lib/calculators/body";
import { validateProfile } from "@/lib/calculators/protein";
import { formatWeight } from "@/lib/calculators/units";
import { FFMI } from "@/lib/config/guidelines";

export function FfmiCalculator({ preset, idPrefix = "ffmi" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody({ sex: "male", ...preset }));
  const [bodyFat, setBodyFat] = useState("15");
  const result = useMemo(() => {
    const weightKg = formWeightKg(form);
    const heightCm = formHeightCm(form);
    const { weight, height } = validateProfile({ age: 30, weightKg, heightCm });
    const bf = positive(bodyFat, 70);
    if (weight || height || bf === null)
      return { ok: false as const, errors: { weight, height }, bfError: bf === null ? "Enter your body fat % (1 to 70)." : undefined };
    return { ok: true as const, r: ffmi({ weightKg, heightCm, bodyFatPct: bf }) };
  }, [form, bodyFat]);

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity hideSex />
          <div>
            <NumberInput id={`${idPrefix}-bf`} label="Body fat %" suffix="%" value={bodyFat} onChange={setBodyFat} invalid={!result.ok && !!result.bfError} describedBy={`${idPrefix}-bf-error`} />
            <FieldError id={`${idPrefix}-bf-error`} message={result.ok ? undefined : result.bfError} />
          </div>
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Your normalized FFMI" value={result.r.normalized}>
            <p>
              FFMI compares your fat-free mass to your height. In the study that created it, men who didn’t use steroids
              topped out at a normalized FFMI of about {FFMI.naturalLimitNormalized}.
            </p>
          </ResultHero>
          <ResultTable
            caption="Your numbers"
            head={["Measure", "Value"]}
            rows={[
              { label: "Fat-free mass", value: formatWeight(result.r.fatFreeMassKg, form.units) },
              { label: "FFMI", value: result.r.ffmi },
              { label: "Normalized FFMI (adjusted to 1.8 m / 5 ft 11 in)", value: result.r.normalized, highlight: true },
            ]}
          />
          <p className="text-xs text-muted">The research was done on men. Use it as a rough guide for women.</p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
