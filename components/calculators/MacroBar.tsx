import type { MacroSplit } from "@/lib/calculators/macros";

const PARTS = [
  { key: "protein", label: "Protein", color: "bg-brand-600" },
  { key: "carbs", label: "Carbs", color: "bg-accent-400" },
  { key: "fat", label: "Fat", color: "bg-brand-200" },
] as const;

export function MacroBar({ macros }: { macros: MacroSplit }) {
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-surface" aria-hidden>
        {PARTS.map((p) => (
          <div key={p.key} className={p.color} style={{ width: `${macros[p.key].percent}%` }} />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {PARTS.map((p) => (
          <div key={p.key}>
            <dt className="flex items-center gap-1.5 text-muted">
              <span aria-hidden className={`size-2.5 rounded-full ${p.color}`} />
              {p.label}
            </dt>
            <dd className="font-semibold tabular-nums">
              {macros[p.key].grams} g <span className="font-normal text-muted">({macros[p.key].percent}%)</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
