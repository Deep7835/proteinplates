"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { LengthInput } from "../fields/LengthInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { convertLength, formHeightCm, formWeightKg, lengthToCm } from "@/lib/calculators/form";
import type { UnitSystem } from "@/lib/calculators/units";
import { bodyFatBand, navyBodyFat, type BodyFatBand } from "@/lib/calculators/body";
import { validateProfile } from "@/lib/calculators/protein";
import { formatWeight } from "@/lib/calculators/units";
import { ACE_BODY_FAT } from "@/lib/config/guidelines";

const BAND_LABELS: Record<BodyFatBand, string> = {
  "very-low": "Very low",
  "below-average": "Below average (lean)",
  average: "Average",
  obesity: "Obesity range",
};

export function BodyFatCalculator({ preset, idPrefix = "bf" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits: setBodyUnits } = useBodyForm(presetBody(preset));
  const metric = form.units === "metric";
  const [neck, setNeck] = useState(form.sex === "male" ? (metric ? "38" : "15") : metric ? "33" : "13");
  const [waist, setWaist] = useState(form.sex === "male" ? (metric ? "86" : "34") : metric ? "76" : "30");
  const [hip, setHip] = useState(metric ? "97" : "38");
  const setUnits = (u: UnitSystem) => {
    setNeck((v) => convertLength(v, form.units, u));
    setWaist((v) => convertLength(v, form.units, u));
    setHip((v) => convertLength(v, form.units, u));
    setBodyUnits(u);
  };

  const result = useMemo(() => {
    const weightKg = formWeightKg(form);
    const heightCm = formHeightCm(form);
    const { weight, height } = validateProfile({ age: 30, weightKg, heightCm });
    if (weight || height) return { ok: false as const, errors: { weight, height } };
    const pct = navyBodyFat({
      sex: form.sex,
      heightCm,
      neckCm: lengthToCm(neck, form.units),
      waistCm: lengthToCm(waist, form.units),
      hipCm: form.sex === "female" ? lengthToCm(hip, form.units) : undefined,
    });
    if (pct === null || !Number.isFinite(pct) || pct < 2 || pct > 70)
      return { ok: false as const, errors: {}, tape: "These measurements don’t give a sensible result. Check each one." };
    const fatKg = (weightKg * pct) / 100;
    return { ok: true as const, pct, band: bodyFatBand(pct, form.sex), fatKg, leanKg: weightKg - fatKg };
  }, [form, neck, waist, hip]);

  const ace = ACE_BODY_FAT[form.sex];
  const tapeError = !result.ok && "tape" in result ? result.tape : undefined;
  const u = form.units;

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity />
          <LengthInput id={`${idPrefix}-neck`} label="Neck" hint="Just below the voice box, tape sloping slightly down to the front." units={u} value={neck} onChange={setNeck} />
          <LengthInput
            id={`${idPrefix}-waist`}
            label={form.sex === "male" ? "Waist (at the belly button)" : "Waist (narrowest point)"}
            hint="Relaxed, at the end of a normal breath out."
            units={u}
            value={waist}
            onChange={setWaist}
            error={tapeError}
          />
          {form.sex === "female" && <LengthInput id={`${idPrefix}-hip`} label="Hips (widest point)" units={u} value={hip} onChange={setHip} />}
        </>
      }
    >
      {result.ok ? (
        <>
          <ResultHero label="Estimated body fat (U.S. Navy method)" value={`${result.pct}%`}>
            <p>
              <strong>{BAND_LABELS[result.band]}</strong>. For {form.sex === "female" ? "women" : "men"}, the American Council on Exercise
              calls {ace.averageMin}–{ace.averageMax}% average and {ace.obesityFrom}% or more the obesity range.
            </p>
          </ResultHero>
          <ResultTable
            caption="What that means in weight"
            head={["", "Amount"]}
            rows={[
              { label: "Fat mass", value: formatWeight(result.fatKg, u) },
              { label: "Lean mass (everything else)", value: formatWeight(result.leanKg, u) },
            ]}
          />
          <p className="text-xs text-muted">Tape methods are estimates. Measure 2–3 times and use the average.</p>
        </>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
