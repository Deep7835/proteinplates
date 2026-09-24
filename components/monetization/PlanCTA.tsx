import { ClipboardList } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function PlanCTA() {
  return (
    <aside className="flex flex-col items-start gap-4 rounded-card border border-accent-100 bg-accent-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <ClipboardList aria-hidden className="mt-0.5 size-6 shrink-0 text-accent-800" />
        <div>
          <p className="font-semibold text-ink">Get your personal protein meal plan</p>
          <p className="text-sm text-muted">Meals and restaurant orders built around your protein target.</p>
        </div>
      </div>
      <LinkButton href="/meal-plan">See the meal plan</LinkButton>
    </aside>
  );
}
