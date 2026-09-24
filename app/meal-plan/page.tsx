import { Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Personal Protein Meal Plan (Coming Soon)",
  description:
    "A personal meal plan built around your protein target, with home meals and restaurant orders. Coming soon.",
  path: "/meal-plan",
});

// Placeholder landing page. The form is disabled: no data is collected and there is no payment yet.
export default function MealPlanPage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Coming soon</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Your personal protein meal plan</h1>
        <p className="mt-4 text-lg text-muted">
          A week of meals and restaurant orders built around your own protein target, your goal, and the places you
          already eat.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl">What you’ll get</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Meals sized to your protein target",
              "High-protein orders at your favorite chains",
              "A simple shopping list",
              "Options for GLP-1 users, gym-goers, and adults 50+",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl">Get notified</h2>
          <p className="mt-2 text-sm text-muted">Sign-up opens soon. This form isn’t active yet.</p>
          <form className="mt-4 space-y-3" aria-describedby="form-status">
            <label htmlFor="mp-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="mp-email"
              type="email"
              disabled
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base"
            />
            <button type="button" disabled className="min-h-11 w-full rounded-lg bg-brand-700 px-5 text-sm font-semibold text-page opacity-60">
              Notify me
            </button>
            <p id="form-status" className="text-xs text-muted">
              Not collecting sign-ups yet.
            </p>
          </form>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <LinkButton href="/protein-calculator" variant="secondary">
          Try the free protein calculator
        </LinkButton>
      </div>
    </Container>
  );
}
