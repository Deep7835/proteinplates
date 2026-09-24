import { Dumbbell, Flame, Leaf } from "lucide-react";
import type { SummaryPicks } from "@/lib/chains/rank";
import { ItemStats } from "./ItemLine";

const CARDS = [
  { key: "bestOverall", title: "Best overall protein pick", Icon: Dumbbell },
  { key: "bestLowCal", title: "Best low-calorie pick", Icon: Flame },
  { key: "bestGlp1", title: "Best GLP-1-friendly pick", Icon: Leaf },
] as const;

export function SummaryCards({ picks }: { picks: SummaryPicks }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map(({ key, title, Icon }) => {
        const item = picks[key];
        return (
          <div key={key} className="rounded-card border border-line bg-page p-5 shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold text-muted">
              <Icon aria-hidden className="size-4 text-brand-700" />
              {title}
            </p>
            {item ? (
              <>
                <p className="mt-2 text-lg font-bold">{item.name}</p>
                <p className="mt-1 text-sm">
                  <ItemStats item={item} />
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">No item fits this yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
