"use client";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  legend: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

/** Segmented control built on native radio inputs (keyboard: arrow keys move between options). */
export function RadioGroup<T extends string>({ legend, name, value, options, onChange }: Props<T>) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{legend}</legend>
      <div className="flex rounded-lg border border-line bg-surface p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-md px-2 text-center text-sm font-medium text-muted has-checked:bg-page has-checked:text-brand-800 has-checked:shadow-card has-focus-visible:outline-2 has-focus-visible:outline-brand-600"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
