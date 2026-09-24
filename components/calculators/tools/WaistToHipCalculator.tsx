"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero } from "../CalcLayout";
import { LengthInput } from "../fields/LengthInput";
import { RadioGroup } from "../fields/RadioGroup";
import { UNIT_OPTIONS } from "../fields/PersonFields";
import type { CalcPreset } from "../presets";
import { convertLength, lengthToCm } from "@/lib/calculators/form";
import { waistToHip } from "@/lib/calculators/body";
import type { Sex } from "@/lib/calculators/tdee";
import type { UnitSystem } from "@/lib/calculators/units";

const WAIST_TEXT = {
  "not-increased": "Your waist size alone is below the WHO’s increased-risk cut-off.",
  increased: "Your waist size alone is in the WHO’s increased-risk range.",
  "substantially-increased": "Your waist size alone is in the WHO’s substantially increased-risk range.",
} as const;

export function WaistToHipCalculator({ preset, idPrefix = "whr" }: { preset?: CalcPreset; idPrefix?: string }) {
  const [units, setUnitsRaw] = useState<UnitSystem>(preset?.units ?? "us");
  const [sex, setSex] = useState<Sex>(preset?.sex ?? "female");
  const [waist, setWaist] = useState(units === "metric" ? "80" : "32");
  const [hip, setHip] = useState(units === "metric" ? "100" : "40");
  const setUnits = (u: UnitSystem) => {
    setWaist((v) => convertLength(v, units, u));
    setHip((v) => convertLength(v, units, u));
    setUnitsRaw(u);
  };
  const result = useMemo(() => {
    const w = lengthToCm(waist, units);
    const h = lengthToCm(hip, units);
    if (!(w > 40 && w < 250 && h > 50 && h < 250)) return null;
    return waistToHip({ sex, waistCm: w, hipCm: h });
  }, [units, sex, waist, hip]);

  return (
    <CalcLayout
      form={
        <>
          <RadioGroup legend="Units" name={`${idPrefix}-units`} value={units} options={UNIT_OPTIONS} onChange={setUnits} />
          <RadioGroup
            legend="Sex"
            name={`${idPrefix}-sex`}
            value={sex}
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
            onChange={setSex}
          />
          <LengthInput id={`${idPrefix}-waist`} label="Waist" hint="At the narrowest point, or halfway between your lowest rib and hip bone." units={units} value={waist} onChange={setWaist} />
          <LengthInput id={`${idPrefix}-hip`} label="Hips" hint="At the widest part of your buttocks." units={units} value={hip} onChange={setHip} />
        </>
      }
    >
      {result ? (
        <ResultHero label="Your waist-to-hip ratio" value={result.ratio.toFixed(2)}>
          <p>
            {result.substantiallyIncreased ? (
              <>
                <strong>At or above the WHO cut-off</strong> of {result.cutoff.toFixed(2)} for {sex === "female" ? "women" : "men"}, which the WHO links to a
                substantially increased risk of metabolic problems like type 2 diabetes.
              </>
            ) : (
              <>
                <strong>Below the WHO cut-off</strong> of {result.cutoff.toFixed(2)} for {sex === "female" ? "women" : "men"}.
              </>
            )}
          </p>
          <p>{WAIST_TEXT[result.waistRisk]}</p>
        </ResultHero>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
