import type { GoalPicks as GoalPicksData } from "@/lib/chains/rank";
import { ItemStats } from "./ItemLine";

export function GoalPicks({ groups }: { groups: GoalPicksData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(({ rule, items }) => (
        <section key={rule.id} aria-labelledby={`goal-${rule.id}`} className="rounded-card border border-line p-5">
          <h3 id={`goal-${rule.id}`} className="text-lg">{rule.label}</h3>
          <p className="mt-1 text-sm text-muted">{rule.description}</p>
          {items.length > 0 ? (
            <ol className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.name} className="text-sm">
                  <span className="font-medium">{item.name}</span>
                  <br />
                  <ItemStats item={item} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-muted">No items on our list match this goal yet.</p>
          )}
        </section>
      ))}
    </div>
  );
}
