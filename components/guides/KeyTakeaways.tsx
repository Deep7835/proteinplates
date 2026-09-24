import { CheckCircle2 } from "lucide-react";

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside aria-labelledby="takeaways-title" className="rounded-card border border-brand-200 bg-brand-50 p-5">
      <h2 id="takeaways-title" className="text-lg text-brand-900">Key takeaways</h2>
      <ul className="mt-3 space-y-2">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-brand-900">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
