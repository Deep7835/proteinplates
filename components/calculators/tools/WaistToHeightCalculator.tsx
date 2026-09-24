"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero } from "../CalcLayout";
import { LengthInput } from "../fields/LengthInput";
import { PersonFields } from "../fields/PersonFields";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { convertLength, formHeightCm, lengthToCm } from "@/lib/calculators/form";
import type { UnitSystem } from "@/lib/calculators/units";
import { waistToHeight, type WhtrBand } from "@/lib/calculators/body";
import { validateProfile } from "@/lib/calculators/protein";

const BANDS: Record<WhtrBand, { label: string; text: string }> = {
  healthy: { label: "Healthy", text: "Your waist is less than half your height. That’s the goal NICE recommends." },
  increased: { label: "Increased health risk", text: "NICE links a ratio of 0.5 to 0.59 with increased health risks, such as type 2 diabetes and heart disease." },
  high: { label: "High health risk", text: "NICE links a ratio of 0.6 or more with further increased health risks. Consider talking to your doctor." },
};

export function WaistToHeightCalculator({ preset, idPrefix = "whtr" }: { preset?: CalcPreset; idPrefix?: string }) {
  const { form, set, setUnits: setBodyUnits } = useBodyForm(presetBody(preset));
  const [waist, setWaist] = useState(form.units === "metric" ? "80" : "32");
  const setUnits = (u: UnitSystem) => {
    setWaist((v) => convertLength(v, form.units, u));
    setBodyUnits(u);
  };
  const result = useMemo(() => {
    const heightCm = formHeightCm(form);
    const { height } = validateProfile({ age: 30, weightKg: 70, heightCm });
    const waistCm = lengthToCm(waist, form.units);
    if (height) return { ok: false as const, errors: { height } };
    if (!(waistCm > 40 && waistCm < 250)) return { ok: false as const, errors: {}, waistError: "Enter your waist size." };
    return { ok: true as const, ...waistToHeight(waistCm, heightCm), halfHeightCm: heightCm / 2 };
  }, [form, waist]);
  const halfHeight = result.ok ? (form.units === "metric" ? `${Math.round(result.halfHeightCm)} cm` : `${Math.round((result.halfHeightCm / 2.54) * 10) / 10} in`) : "";

  return (
    <CalcLayout
      form={
        <>
          <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} hideAge hideActivity hideSex bodyShow="height" />
          <LengthInput
            id={`${idPrefix}-waist`}
            label="Waist"
            hint="Halfway between your lowest rib and the top of your hip bone, after breathing out."
            units={form.units}
            value={waist}
            onChange={setWaist}
            error={!result.ok && "waistError" in result ? result.waistError : undefined}
          />
        </>
      }
    >
      {result.ok ? (
        <ResultHero label="Your waist-to-height ratio" value={result.ratio.toFixed(2)}>
          <p>
            <strong>{BANDS[result.band].label}.</strong> {BANDS[result.band].text}
          </p>
          <p>To stay under 0.5, keep your waist below {halfHeight}.</p>
        </ResultHero>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
