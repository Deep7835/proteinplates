import type { RankableItem } from "@/lib/chains/rank";
import { proteinPer100Cal } from "@/lib/chains/rank";

/** "62 g protein · 700 cal · 8.9 g per 100 cal" */
export function ItemStats({ item }: { item: RankableItem }) {
  return (
    <span className="tabular-nums">
      <strong className="text-brand-800">{item.protein_g} g protein</strong> · {item.calories} cal · {proteinPer100Cal(item)} g per 100 cal
    </span>
  );
}
