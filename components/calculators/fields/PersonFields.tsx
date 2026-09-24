"use client";

import { ACTIVITY_LEVELS, type ActivityLevel } from "@/lib/config/calories";
import type { BodyFormState } from "@/lib/calculators/form";
import type { ProfileErrors } from "@/lib/calculators/protein";
import type { UnitSystem } from "@/lib/calculators/units";
import { BodyFields } from "./BodyFields";
import { FieldError } from "./FieldError";
import { NumberInput } from "./NumberInput";
import { RadioGroup } from "./RadioGroup";
import { SelectField } from "./SelectField";

export const UNIT_OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: "us", label: "US (lb)" },
  { value: "uk", label: "UK (st)" },
  { value: "metric", label: "Metric (kg)" },
];

type Props = {
  idPrefix: string;
  form: BodyFormState;
  errors: ProfileErrors;
  onChange: (patch: Partial<BodyFormState>) => void;
  onUnitsChange: (units: UnitSystem) => void;
  /** BMI doesn't need sex, age, or activity. */
  bodyOnly?: boolean;
  /** Hide pieces some calculators don't use. */
  hideAge?: boolean;
  hideActivity?: boolean;
  hideSex?: boolean;
  bodyShow?: "both" | "weight" | "height";
};

/** Units, sex, age, weight, height, and activity: the inputs every calculator shares. */
export function PersonFields({
  idPrefix,
  form,
  errors,
  onChange,
  onUnitsChange,
  bodyOnly = false,
  hideAge = bodyOnly,
  hideActivity = bodyOnly,
  hideSex = bodyOnly,
  bodyShow = "both",
}: Props) {
  return (
    <>
      <RadioGroup
        legend="Units"
        name={`${idPrefix}-units`}
        value={form.units}
        options={UNIT_OPTIONS}
        onChange={onUnitsChange}
      />

      {(!hideSex || !hideAge) && (
        <div className="grid grid-cols-2 gap-4">
          {!hideSex && (
            <RadioGroup
              legend="Sex"
              name={`${idPrefix}-sex`}
              value={form.sex}
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
              ]}
              onChange={(sex) => onChange({ sex })}
            />
          )}
          {!hideAge && (
            <div>
              <NumberInput
                id={`${idPrefix}-age`}
                label="Age"
                suffix="yrs"
                value={form.age}
                onChange={(age) => onChange({ age })}
                min={18}
                max={100}
                invalid={!!errors.age}
                describedBy={`${idPrefix}-age-error`}
              />
              <FieldError id={`${idPrefix}-age-error`} message={errors.age} />
            </div>
          )}
        </div>
      )}

      <BodyFields
        idPrefix={idPrefix}
        units={form.units}
        values={form}
        onChange={onChange}
        errors={errors}
        show={bodyShow}
      />

      {!hideActivity && (
        <SelectField<ActivityLevel>
          id={`${idPrefix}-activity`}
          label="Activity level"
          value={form.activity}
          options={ACTIVITY_LEVELS.map((a) => ({
            value: a.id,
            label: `${a.label}: ${a.description}`,
          }))}
          onChange={(activity) => onChange({ activity })}
        />
      )}
    </>
  );
}
