"use client";

import type { ComponentProps } from "react";

type Props = {
  id: string;
  label: string;
  /** Visually hidden label, e.g. for the "in" half of a ft/in pair. */
  hideLabel?: boolean;
  suffix?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
} & Omit<ComponentProps<"input">, "value" | "onChange" | "id" | "type">;

export function NumberInput({ id, label, hideLabel, suffix, value, onChange, invalid, describedBy, ...rest }: Props) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-medium"}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`h-11 w-full rounded-lg border bg-page px-3 text-base tabular-nums ${suffix ? "pr-10" : ""} ${
            invalid ? "border-danger-700" : "border-line"
          } focus:border-brand-600`}
          {...rest}
        />
        {suffix && (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
