import type { RankableItem } from "@/lib/chains/rank";
import { MEAL_BUILDER } from "@/lib/config/goals";

export function BuildAMeal({ items }: { items: RankableItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name} className="rounded-card border border-line p-4">
          <p className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-semibold">{item.name}</span>
            <span className={`text-sm font-semibold tabular-nums ${item.protein_g >= MEAL_BUILDER.targetProteinG ? "text-brand-700" : "text-muted"}`}>
              {item.protein_g} g protein · {item.calories} cal
            </span>
          </p>
          <p className="mt-1 text-sm">
            <span className="font-medium">How to order:</span> {item.custom_order_tip}
          </p>
        </li>
      ))}
    </ul>
  );
}
