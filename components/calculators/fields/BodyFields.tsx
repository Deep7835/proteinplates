"use client";

import type { UnitSystem } from "@/lib/calculators/units";
import { FieldError } from "./FieldError";
import { NumberInput } from "./NumberInput";

type Values = {
  weight: string;
  weight2: string;
  height: string;
  height2: string;
};

type Props = {
  idPrefix: string;
  units: UnitSystem;
  values: Values;
  onChange: (patch: Partial<Values>) => void;
  errors: { weight?: string; height?: string };
  /** Which inputs to show. Default: both. */
  show?: "both" | "weight" | "height";
  weightLabel?: string;
};

/** Weight + height inputs that adapt to US (lb, ft/in), UK (st/lb, ft/in), or metric (kg, cm). */
export function BodyFields({
  idPrefix,
  units,
  values,
  onChange,
  errors,
  show = "both",
  weightLabel = "Weight",
}: Props) {
  const wErr = `${idPrefix}-weight-error`;
  const hErr = `${idPrefix}-height-error`;
  return (
    <>
      {show !== "height" && (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">{weightLabel}</legend>
          <div className="flex gap-2">
            {units === "us" && (
              <NumberInput
                id={`${idPrefix}-lb`}
                label="Weight in pounds"
                hideLabel
                suffix="lb"
                value={values.weight}
                onChange={(v) => onChange({ weight: v })}
                min={70}
                max={700}
                invalid={!!errors.weight}
                describedBy={wErr}
              />
            )}
            {units === "uk" && (
              <>
                <NumberInput
                  id={`${idPrefix}-st`}
                  label="Stone"
                  hideLabel
                  suffix="st"
                  value={values.weight}
                  onChange={(v) => onChange({ weight: v })}
                  min={5}
                  max={50}
                  invalid={!!errors.weight}
                  describedBy={wErr}
                />
                <NumberInput
                  id={`${idPrefix}-stlb`}
                  label="Pounds"
                  hideLabel
                  suffix="lb"
                  value={values.weight2}
                  onChange={(v) => onChange({ weight2: v })}
                  min={0}
                  max={13}
                  invalid={!!errors.weight}
                  describedBy={wErr}
                />
              </>
            )}
            {units === "metric" && (
              <NumberInput
                id={`${idPrefix}-kg`}
                label="Weight in kilograms"
                hideLabel
                suffix="kg"
                value={values.weight}
                onChange={(v) => onChange({ weight: v })}
                min={35}
                max={320}
                invalid={!!errors.weight}
                describedBy={wErr}
              />
            )}
          </div>
          <FieldError id={wErr} message={errors.weight} />
        </fieldset>
      )}

      {show !== "weight" && (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">Height</legend>
          <div className="flex gap-2">
            {units === "metric" ? (
              <NumberInput
                id={`${idPrefix}-cm`}
                label="Height in centimeters"
                hideLabel
                suffix="cm"
                value={values.height}
                onChange={(v) => onChange({ height: v })}
                min={120}
                max={230}
                invalid={!!errors.height}
                describedBy={hErr}
              />
            ) : (
              <>
                <NumberInput
                  id={`${idPrefix}-ft`}
                  label="Feet"
                  hideLabel
                  suffix="ft"
                  value={values.height}
                  onChange={(v) => onChange({ height: v })}
                  min={3}
                  max={7}
                  invalid={!!errors.height}
                  describedBy={hErr}
                />
                <NumberInput
                  id={`${idPrefix}-in`}
                  label="Inches"
                  hideLabel
                  suffix="in"
                  value={values.height2}
                  onChange={(v) => onChange({ height2: v })}
                  min={0}
                  max={11}
                  invalid={!!errors.height}
                  describedBy={hErr}
                />
              </>
            )}
          </div>
          <FieldError id={hErr} message={errors.height} />
        </fieldset>
      )}
    </>
  );
}
