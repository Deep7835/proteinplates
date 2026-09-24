import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";

/** Two-column calculator layout: inputs on the left, results on the right (stacked on mobile). */
export function CalcLayout({ form, children, disclaimer = true }: { form: ReactNode; children: ReactNode; disclaimer?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <Card className="space-y-5">
        <h2 className="text-xl">Your details</h2>
        {form}
      </Card>
      <div className="space-y-5">
        {children}
        {disclaimer && <Disclaimer />}
      </div>
    </div>
  );
}

/** The main result in a highlighted card. */
export function ResultHero({ label, value, unit, children }: { label: string; value: ReactNode; unit?: string; children?: ReactNode }) {
  return (
    <Card className="border-brand-200 bg-brand-50">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">{label}</h2>
      <p aria-live="polite" className="mt-1 text-4xl font-bold tabular-nums text-brand-900 sm:text-5xl">
        {value}
        {unit && <span className="ml-2 text-lg font-normal">{unit}</span>}
      </p>
      {children && <div className="mt-3 space-y-2 text-sm text-brand-900">{children}</div>}
    </Card>
  );
}

export function FixFields() {
  return (
    <Card>
      <p className="font-medium">Check the highlighted fields to see your results.</p>
    </Card>
  );
}

/** Simple two-column table of label → value rows. */
export function ResultTable({ caption, head, rows }: { caption: string; head: [string, string]; rows: { label: ReactNode; value: ReactNode; highlight?: boolean }[] }) {
  return (
    <Card>
      <table className="w-full text-sm">
        <caption className="mb-2 text-left text-lg font-bold text-ink">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-left text-muted">
            <th scope="col" className="py-2 font-medium">{head[0]}</th>
            <th scope="col" className="py-2 text-right font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-line last:border-0 ${r.highlight ? "bg-brand-50 font-semibold" : ""}`}>
              <th scope="row" className="py-2 pr-3 text-left font-normal">{r.label}</th>
              <td className="py-2 text-right">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
