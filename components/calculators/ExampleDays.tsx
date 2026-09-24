import type { ExampleDay } from "@/lib/calculators/exampleDays";

const SLOT_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" } as const;

export function ExampleDays({ days }: { days: ExampleDay[] }) {
  return (
    <div className="space-y-3">
      {days.map((day, i) => (
        <details key={day.title} open={i === 0} className="group rounded-card border border-line bg-page">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span className="font-semibold">{day.title}</span>
            <span className="text-sm text-muted">
              <span className="font-semibold text-brand-700 tabular-nums">{day.totalProteinG} g</span> protein
              <span aria-hidden className="ml-2 inline-block transition-transform group-open:rotate-180">▾</span>
            </span>
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {day.meals.map((meal) => (
              <li key={meal.slot} className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">
                    <span className="text-muted">{SLOT_LABELS[meal.slot]}:</span> {meal.name}
                  </p>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">{meal.proteinG} g</p>
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                  {meal.items.map((item) => (
                    <li key={item.label}>
                      {item.label} <span className="tabular-nums">({item.proteinG} g)</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      ))}
      <p className="text-xs text-muted">
        Protein values from{" "}
        <a href="https://fdc.nal.usda.gov/" rel="noopener" target="_blank">
          USDA FoodData Central
        </a>
        . Brands vary, so check your food labels.
      </p>
    </div>
  );
}
