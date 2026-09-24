"use client";

import { useMemo } from "react";
import { chipClass } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { GOAL_CALORIE_ADJUSTMENT } from "@/lib/config/calories";
import { GOALS, GOAL_LABELS, type Goal } from "@/lib/config/protein";
import { buildExampleDays } from "@/lib/calculators/exampleDays";
import {
  DEFAULT_FORM,
  convertFormUnits,
  formFromSearchParams,
  formToProfile,
  formToSearchParams,
  type ProteinFormState,
} from "@/lib/calculators/form";
import { calculateProteinPlan } from "@/lib/calculators/protein";
import { formatWeight } from "@/lib/calculators/units";
import type { NavLink } from "@/lib/config/site";
import { PersonFields } from "./fields/PersonFields";
import { RadioGroup } from "./fields/RadioGroup";
import { SelectField } from "./fields/SelectField";
import { ExampleDays } from "./ExampleDays";
import { MacroBar } from "./MacroBar";
import { ShareButton } from "./ShareButton";
import { presetBody, type CalcPreset } from "./presets";
import { useUrlSyncedState } from "./useUrlSyncedState";

// Short, food-only tips per goal. GLP-1 copy must stay about food: no doses, injections, or side effects.
const GOAL_TIPS: Record<Goal, string> = {
  lose: "Eating more protein helps you feel full and keep muscle while you lose fat.",
  maintain: "Spread your protein across your meals. A palm-sized portion of protein at each meal is a good start.",
  build: "Pair this with strength training. Spread protein across the day, with some after your workout.",
  glp1: "Eat the protein part of your meal first. Small, protein-rich meals and snacks, like Greek yogurt, eggs, fish, or chicken, can make your target easier to reach.",
  aging: "Aim for protein at every meal, not just dinner. Strength exercise helps your body use the protein to keep muscle.",
};

type Props = {
  /** Preselects a goal (e.g. on audience hub pages). */
  initialGoal?: Goal;
  /** Write inputs to the URL as the user types (only on the main calculator page). */
  syncUrl?: boolean;
  /** Chain pages to suggest under "Eating out?". */
  chainLinks?: NavLink[];
  /** Unique prefix so the calculator can appear twice without duplicate ids. */
  idPrefix?: string;
  /** Preselected sex, goal, units, etc. (landing pages like "for women"). */
  preset?: CalcPreset;
};

export function ProteinCalculator({ initialGoal, syncUrl = false, chainLinks = [], idPrefix = "pc", preset }: Props) {
  const initial = useMemo(
    () => ({ ...DEFAULT_FORM, ...presetBody(preset), goal: preset?.goal ?? initialGoal ?? DEFAULT_FORM.goal }),
    [initialGoal, preset],
  );
  const [form, setForm] = useUrlSyncedState<ProteinFormState>({
    initial,
    parse: (p) => formFromSearchParams(p, initial),
    serialize: formToSearchParams,
    syncUrl,
  });

  const set = (patch: Partial<ProteinFormState>) => setForm((f) => ({ ...f, ...patch }));

  const result = useMemo(() => {
    const r = formToProfile(form);
    if (!r.ok) return { ok: false as const, errors: r.errors };
    const plan = calculateProteinPlan(r.profile);
    const days = buildExampleDays({ minG: plan.proteinG.min, maxG: plan.proteinG.max }, r.profile.mealsPerDay);
    return { ok: true as const, plan, days };
  }, [form]);

  const errors = result.ok ? {} : result.errors;
  const shareHref = `/protein-calculator?${formToSearchParams(form).toString()}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <Card className="space-y-5">
        <h2 className="text-xl">Your details</h2>

        <PersonFields
          idPrefix={idPrefix}
          form={form}
          errors={errors}
          onChange={set}
          onUnitsChange={(u) => setForm((f) => convertFormUnits(f, u))}
        />

        <SelectField<Goal>
          id={`${idPrefix}-goal`}
          label="Your goal"
          value={form.goal}
          options={GOALS.map((g) => ({ value: g, label: GOAL_LABELS[g] }))}
          onChange={(goal) => set({ goal })}
        />

        <RadioGroup
          legend="Meals a day"
          name={`${idPrefix}-meals`}
          value={String(form.meals) as "3" | "4"}
          options={[
            { value: "3", label: "3 meals" },
            { value: "4", label: "3 meals + snack" },
          ]}
          onChange={(m) => set({ meals: m === "4" ? 4 : 3 })}
        />
      </Card>

      <div className="space-y-5">
        {result.ok ? (
          <>
            <Card className="border-brand-200 bg-brand-50">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">Your daily protein target</h2>
              <div aria-live="polite">
                <p className="mt-1 text-4xl font-bold tabular-nums text-brand-900 sm:text-5xl">
                  {result.plan.proteinG.min}–{result.plan.proteinG.max} g
                </p>
                <p className="mt-2 text-brand-900">
                  That’s about{" "}
                  <strong className="tabular-nums">
                    {result.plan.perMealG.min}–{result.plan.perMealG.max} g
                  </strong>{" "}
                  per meal across {form.meals === 4 ? "3 meals and a snack" : "3 meals"}.
                </p>
              </div>
              <p className="mt-3 text-sm text-brand-900">
                Based on {result.plan.gramsPerKg.min}–{result.plan.gramsPerKg.max} g of protein per kg of body weight.
                {result.plan.usedReferenceWeight && (
                  <>
                    {" "}
                    Extra body fat doesn’t need extra protein, so we used{" "}
                    <strong>{formatWeight(result.plan.referenceWeightKg, form.units)}</strong>, the weight at a BMI of 30
                    for your height.
                  </>
                )}
              </p>
              <p className="mt-3 text-sm text-brand-900">{GOAL_TIPS[form.goal]}</p>
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Calories</h3>
                <p className="mt-1 text-3xl font-bold tabular-nums">{result.plan.calories.target.toLocaleString("en-US")}</p>
                <p className="text-sm text-muted">calories a day</p>
                <p className="mt-2 text-xs text-muted">
                  Maintenance: {result.plan.calories.maintenance.toLocaleString("en-US")} ·{" "}
                  {goalAdjustmentText(form.goal)}
                  {result.plan.calories.floorApplied && " · raised to a safe minimum"}
                </p>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Daily macros</h3>
                <div className="mt-3">
                  <MacroBar macros={result.plan.macros} />
                </div>
              </Card>
            </div>

            <section aria-labelledby={`${idPrefix}-food-title`}>
              <h3 id={`${idPrefix}-food-title`} className="text-lg">
                What this looks like in food
              </h3>
              <div className="mt-3">
                <ExampleDays days={result.days} />
              </div>
            </section>
          </>
        ) : (
          <Card>
            <p className="font-medium">Check the highlighted fields to see your results.</p>
          </Card>
        )}

        <section aria-labelledby={`${idPrefix}-out-title`} className="rounded-card border border-line p-5">
          <h3 id={`${idPrefix}-out-title`} className="text-lg">
            Eating out?
          </h3>
          <p className="mt-1 text-sm text-muted">See the highest-protein orders at popular chains.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {chainLinks.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={chipClass}>
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/chains" className="inline-flex min-h-10 items-center gap-1 px-2 text-sm font-medium">
                All chains <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          </ul>
        </section>

        <ShareButton path={shareHref} />
        <Disclaimer />
      </div>
    </div>
  );
}

function goalAdjustmentText(goal: Goal): string {
  const pct = Math.round(GOAL_CALORIE_ADJUSTMENT[goal] * 100);
  if (pct === 0) return "no change for your goal";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)}% for your goal`;
}
