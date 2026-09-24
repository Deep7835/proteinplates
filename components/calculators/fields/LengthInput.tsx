"use client";

import type { UnitSystem } from "@/lib/calculators/units";
import { FieldError } from "./FieldError";
import { NumberInput } from "./NumberInput";

/** Tape measurement in inches (US/UK) or cm (metric). */
export function LengthInput({
  id,
  label,
  hint,
  units,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  units: UnitSystem;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const metric = units === "metric";
  return (
    <div>
      <NumberInput
        id={id}
        label={label}
        suffix={metric ? "cm" : "in"}
        value={value}
        onChange={onChange}
        min={metric ? 20 : 8}
        max={metric ? 250 : 100}
        step="0.1"
        invalid={!!error}
        describedBy={`${id}-hint ${id}-error`}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
