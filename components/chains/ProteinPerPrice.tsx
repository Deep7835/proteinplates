import type { PricedItem } from "@/lib/chains/rank";
import { CURRENCY_DISPLAY, formatMoney } from "@/lib/chains/format";
import type { Currency } from "@/lib/schema/chain";

export function ProteinPerPrice({ items, currency }: { items: PricedItem[]; currency: Currency }) {
  const unit = CURRENCY_DISPLAY[currency].perLabel;
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[480px] text-sm">
        <caption className="sr-only">Protein per {unit} spent</caption>
        <thead className="bg-surface text-left">
          <tr>
            <th scope="col" className="px-3 py-2">Item</th>
            <th scope="col" className="px-3 py-2 text-right">Price</th>
            <th scope="col" className="px-3 py-2 text-right">Protein (g)</th>
            <th scope="col" className="px-3 py-2 text-right">Protein per {unit}</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {items.map((i) => (
            <tr key={i.name} className="border-t border-line">
              <th scope="row" className="px-3 py-2 text-left font-medium">{i.name}</th>
              <td className="px-3 py-2 text-right">{formatMoney(i.price, currency)}</td>
              <td className="px-3 py-2 text-right">{i.protein_g}</td>
              <td className="px-3 py-2 text-right font-semibold">{i.proteinPerUnit} g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
