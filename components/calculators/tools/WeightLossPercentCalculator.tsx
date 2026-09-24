"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero } from "../CalcLayout";
import { NumberInput } from "../fields/NumberInput";
import { RadioGroup } from "../fields/RadioGroup";
import type { CalcPreset } from "../presets";
import { positive } from "@/lib/calculators/form";
import { weightLossPercent } from "@/lib/calculators/weightLoss";

type Unit = "lb" | "kg" | "st";

export function WeightLossPercentCalculator({ preset, idPrefix = "wlp" }: { preset?: CalcPreset; idPrefix?: string }) {
  const [unit, setUnit] = useState<Unit>(preset?.units === "metric" ? "kg" : preset?.units === "uk" ? "st" : "lb");
  const [start, setStart] = useState(unit === "kg" ? "100" : unit === "st" ? "16" : "220");
  const [now, setNow] = useState(unit === "kg" ? "92" : unit === "st" ? "14.5" : "200");
  const result = useMemo(() => {
    const s = positive(start, 1500);
    const n = positive(now, 1500);
    return s && n ? weightLossPercent(s, n) : null;
  }, [start, now]);

  return (
    <CalcLayout
      disclaimer={false}
      form={
        <>
          <RadioGroup
            legend="Units"
            name={`${idPrefix}-unit`}
            value={unit}
            options={[
              { value: "lb", label: "Pounds" },
              { value: "st", label: "Stone" },
              { value: "kg", label: "Kilograms" },
            ]}
            onChange={setUnit}
          />
          <NumberInput id={`${idPrefix}-start`} label="Starting weight" suffix={unit} value={start} onChange={setStart} step="0.1" />
          <NumberInput id={`${idPrefix}-now`} label="Current weight" suffix={unit} value={now} onChange={setNow} step="0.1" />
        </>
      }
    >
      {result ? (
        <ResultHero label={result.percent >= 0 ? "You’ve lost" : "You’ve gained"} value={`${Math.abs(result.percent)}%`} unit="of your starting weight">
          <p>
            That’s {Math.abs(result.lost)} {unit} {result.percent >= 0 ? "down" : "up"}.
          </p>
          {result.reached.includes(5) && <p>You’ve passed 5%. The CDC says a 5% loss can lower the risk of some chronic diseases, like heart disease and type 2 diabetes.</p>}
          {result.next && result.percent >= 0 && (
            <p>
              Next milestone: {result.next.percent}% at {result.next.weightAt} {unit}.
            </p>
          )}
        </ResultHero>
      ) : (
        <FixFields />
      )}
    </CalcLayout>
  );
}
