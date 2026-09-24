import type { ReactNode } from "react";

/** A labeled big number, used in calculator results. */
export function ResultStat({ label, value, unit, children }: { label: string; value: string; unit?: string; children?: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{label}</h3>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-muted">{unit}</span>}
      </p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </div>
  );
}
