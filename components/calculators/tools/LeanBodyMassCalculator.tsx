"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { FieldError } from "../fields/FieldError";
import { NumberInput } from "../fields/NumberInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formHeightCm, formWeightKg, positive } from "@/lib/calculators/form";
import { leanBodyMass } from "@/lib/calculators/body";
import { validateProfile } from "@/lib/calculators/protein";
import { formatWeight } from "@/lib/calculators/units";

export function LeanBodyMassCalculator({ preset, idPrefix = "lbm" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const [bodyFat, setBodyFat] = useState("");
  const result = useMemo(() => {
    const weightKg = formWeightKg(form);
    const heightCm = formHeightCm(form);
    const { weight, height } = validateProfile({ age: 30, weightKg, heightCm });
    if (weight || height) return { ok: false as const, errors: { weight, height } };
    const bf = bodyFat.trim() === "" ? null : positive(bodyFat, 70);
    if (bodyFat.trim() !== "" && bf === null) return { ok: false as const, errors: {}, bfError: "Enter a body fat % from 1 to 70, or leave it blank." };
    return { ok: true as const, weightKg, lbm: leanBodyMass({ sex: form.sex, weightKg, heightCm, bodyFatPct: bf }) };
  }, [form, bodyFat]);
  const f = (kg: number) => formatWeight(kg, form.units);

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity />
          <div>
            <NumberInput id={`${idPrefix}-bf`} label="Body fat % (optional)" suffix="%" value={bodyFat} onChange={setBodyFat} describedBy={`${idPrefix}-bf-error`} />
            <FieldError id={`${idPrefix}-bf-error`} message={!result.ok && "bfError" in result ? result.bfError : undefined} />
          </div>
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Estimated lean body mass" value={f(result.lbm.fromBodyFat ?? result.lbm.boer)}>
            <p>
              {result.lbm.fromBodyFat !== null
                ? "Based on the body fat % you entered."
                : "Using the Boer formula, which only needs your height and weight."}{" "}
              That’s about {Math.round(((result.lbm.fromBodyFat ?? result.lbm.boer) / result.weightKg) * 100)}% of your weight.
            </p>
          </ResultHero>
          <ResultTable
            caption="Lean mass by method"
            head={["Method", "Lean mass"]}
            rows={[
              { label: "From your body fat %", value: result.lbm.fromBodyFat === null ? "Add body fat %" : f(result.lbm.fromBodyFat) },
              { label: "Boer (1984)", value: f(result.lbm.boer) },
              { label: "Hume (1966)", value: f(result.lbm.hume) },
            ]}
          />
          <p className="text-xs text-muted">
            Don’t know your body fat? Estimate it with our <Link href="/body-fat-calculator">body fat calculator</Link>.
          </p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
