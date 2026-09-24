"use client";

import { useState } from "react";
import { CalcLayout, ResultHero, ResultTable } from "../CalcLayout";
import { RadioGroup } from "../fields/RadioGroup";
import type { CalcPreset } from "../presets";
import { LITERS_PER_US_CUP, ML_PER_US_FL_OZ, waterTargets } from "@/lib/calculators/nutrients";
import type { Sex } from "@/lib/calculators/tdee";

const cups = (l: number) => Math.round((l / LITERS_PER_US_CUP) * 10) / 10;
const oz = (l: number) => Math.round((l * 1000) / ML_PER_US_FL_OZ);

export function WaterIntakeCalculator({ preset, idPrefix = "water" }: { preset?: CalcPreset; idPrefix?: string }) {
  const [sex, setSex] = useState<Sex>(preset?.sex ?? "female");
  const t = waterTargets(sex);

  return (
    <CalcLayout
      disclaimer={false}
      form={
        <>
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
          <p className="text-sm text-muted">
            Official guidelines set water needs by sex for healthy adults. You need more in hot weather, when you exercise,
            or if you’re pregnant or breastfeeding.
          </p>
        </>
      }
    >
      <ResultHero label="Water from drinks, per day" value={`${t.nasemFromDrinksL} L`}>
        <p>
          That’s about {cups(t.nasemFromDrinksL)} cups or {oz(t.nasemFromDrinksL)} fl oz. It’s about 80% of the{" "}
          {t.nasemTotalL} L total the U.S. National Academies suggest; the other 20% usually comes from food.
        </p>
      </ResultHero>
      <ResultTable
        caption="What the guidelines say (total water from food and drinks)"
        head={["Source", "Per day"]}
        rows={[
          { label: "U.S. National Academies", value: `${t.nasemTotalL} L (${oz(t.nasemTotalL)} fl oz)`, highlight: true },
          { label: "European Food Safety Authority (EFSA)", value: `${t.efsaTotalL} L (${oz(t.efsaTotalL)} fl oz)` },
        ]}
      />
      <p className="text-sm text-muted">
        Exercising? The American College of Sports Medicine suggests drinking enough to avoid losing more than 2% of your
        body weight during exercise. Weighing yourself before and after a workout shows how much you lost.
      </p>
    </CalcLayout>
  );
}
