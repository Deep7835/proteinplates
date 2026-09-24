"use client";

import { useMemo, useState } from "react";
import { CalcLayout, FixFields, ResultHero, ResultTable } from "../CalcLayout";
import { PersonFields } from "../fields/PersonFields";
import { RadioGroup } from "../fields/RadioGroup";
import { SelectField } from "../fields/SelectField";
import { presetBody, type CalcPreset } from "../presets";
import { useBodyForm } from "../useBodyForm";
import { formToBody } from "@/lib/calculators/form";
import { carbTargets, fiberTargets, ketoMacros, sugarLimits } from "@/lib/calculators/nutrients";
import { calculateProteinPlan } from "@/lib/calculators/protein";
import { calculateTdee } from "@/lib/calculators/tdee";
import { KETO } from "@/lib/config/guidelines";
import { GOALS, GOAL_LABELS, type Goal } from "@/lib/config/protein";

const fmt = (n: number) => n.toLocaleString("en-US");

type Mode = "fiber" | "carbs" | "keto" | "sugar";

/** One component for the calorie-based nutrient calculators (fiber, carbs, keto, sugar). */
function NutrientTargets({ mode, preset, idPrefix }: { mode: Mode; preset?: CalcPreset; idPrefix: string }) {
  const { form, set, setUnits } = useBodyForm(presetBody(preset));
  const [goal, setGoal] = useState<Goal>(preset?.goal ?? (mode === "keto" ? "lose" : "maintain"));
  const [ketoCarbs, setKetoCarbs] = useState<string>("20");
  const needsGoal = mode === "carbs" || mode === "keto";

  const result = useMemo(() => {
    const r = formToBody(form);
    if (!r.ok) return r;
    const maintenance = calculateTdee(r.body).maintenance;
    const plan = calculateProteinPlan({ ...r.body, goal, mealsPerDay: 3 });
    return { ok: true as const, body: r.body, maintenance, plan };
  }, [form, goal]);

  const fields = (
    <>
      <PersonFields idPrefix={idPrefix} form={form} errors={result.ok ? {} : result.errors} onChange={set} onUnitsChange={setUnits} />
      {needsGoal && (
        <SelectField<Goal>
          id={`${idPrefix}-goal`}
          label="Your goal"
          value={goal}
          options={GOALS.map((g) => ({ value: g, label: GOAL_LABELS[g] }))}
          onChange={setGoal}
        />
      )}
      {mode === "keto" && (
        <RadioGroup
          legend="Daily carb limit"
          name={`${idPrefix}-carbs`}
          value={ketoCarbs}
          options={KETO.carbOptions.map((c) => ({ value: String(c), label: `${c} g` }))}
          onChange={setKetoCarbs}
        />
      )}
    </>
  );

  if (!result.ok) return <CalcLayout form={fields}><FixFields /></CalcLayout>;
  const { body, maintenance, plan } = result;

  let content: React.ReactNode = null;
  if (mode === "fiber") {
    const f = fiberTargets({ sex: body.sex, age: body.age, calories: maintenance });
    content = (
      <>
        <ResultHero label="Your daily fiber target" value={`${f.byCalories} g`}>
          <p>That’s 14 g for every 1,000 calories you eat, based on about {fmt(maintenance)} calories a day.</p>
        </ResultHero>
        <ResultTable
          caption="Fiber guidelines for you"
          head={["Guideline", "Grams a day"]}
          rows={[
            { label: "14 g per 1,000 calories", value: `${f.byCalories} g`, highlight: true },
            { label: `Adequate intake (${body.sex === "female" ? "women" : "men"} ${body.age > 50 ? "51+" : "19–50"})`, value: `${f.adequateIntake} g` },
          ]}
        />
        <p className="text-xs text-muted">Add fiber slowly and drink water with it to avoid stomach upset.</p>
      </>
    );
  } else if (mode === "carbs") {
    const c = carbTargets(plan.calories.target);
    content = (
      <>
        <ResultHero label="Your daily carb range" value={`${c.min}–${c.max} g`}>
          <p>That’s 45–65% of your {fmt(plan.calories.target)} daily calories, the range U.S. guidelines suggest.</p>
        </ResultHero>
        <ResultTable
          caption="Carb numbers for you"
          head={["Guideline", "Grams a day"]}
          rows={[
            { label: "Healthy range (45–65% of calories)", value: `${c.min}–${c.max} g`, highlight: true },
            { label: "Minimum for adults (RDA)", value: `${c.rda} g` },
            { label: "Our protein-first macro split", value: `${plan.macros.carbs.grams} g` },
          ]}
        />
      </>
    );
  } else if (mode === "keto") {
    const k = ketoMacros({ calories: plan.calories.target, carbsG: Number(ketoCarbs), proteinG: plan.proteinG.mid });
    content = (
      <>
        <ResultHero label="Your keto macros" value={`${fmt(plan.calories.target)}`} unit="calories a day">
          <p>
            {k.carbs.grams} g carbs, {k.protein.grams} g protein, {k.fat.grams} g fat.
          </p>
        </ResultHero>
        <ResultTable
          caption="Daily keto targets"
          head={["Macro", "Grams (share of calories)"]}
          rows={[
            { label: "Carbs", value: `${k.carbs.grams} g (${k.carbs.percent}%)` },
            { label: "Protein (middle of your protein range)", value: `${k.protein.grams} g (${k.protein.percent}%)`, highlight: true },
            { label: "Fat (the rest)", value: `${k.fat.grams} g (${k.fat.percent}%)` },
          ]}
        />
        <p className="text-xs text-muted">
          Keto isn’t right for everyone. If you have diabetes, kidney disease, or take medicine, talk to your doctor first.
        </p>
      </>
    );
  } else {
    const s = sugarLimits({ sex: body.sex, calories: maintenance });
    content = (
      <>
        <ResultHero label="Keep added sugar under" value={`${s.aha.grams} g`} unit="a day">
          <p>
            That’s the American Heart Association limit for {body.sex === "female" ? "most women" : "most men"}, about {s.aha.teaspoons} teaspoons.
          </p>
        </ResultHero>
        <ResultTable
          caption={`Sugar limits for about ${fmt(maintenance)} calories a day`}
          head={["Guideline", "Grams a day"]}
          rows={[
            { label: "American Heart Association (added sugar)", value: `${s.aha.grams} g`, highlight: true },
            { label: "WHO: under 10% of calories (free sugars)", value: `${s.whoMax} g` },
            { label: "WHO: under 5% for extra benefit", value: `${s.whoIdeal} g` },
          ]}
        />
        <p className="text-xs text-muted">These limits are for added and free sugars, not the natural sugar in whole fruit, vegetables, or plain milk.</p>
      </>
    );
  }

  return <CalcLayout form={fields}>{content}</CalcLayout>;
}

export const FiberCalculator = (p: { preset?: CalcPreset }) => <NutrientTargets mode="fiber" idPrefix="fiber" {...p} />;
export const CarbCalculator = (p: { preset?: CalcPreset }) => <NutrientTargets mode="carbs" idPrefix="carb" {...p} />;
export const KetoCalculator = (p: { preset?: CalcPreset }) => <NutrientTargets mode="keto" idPrefix="keto" {...p} />;
export const SugarIntakeCalculator = (p: { preset?: CalcPreset }) => <NutrientTargets mode="sugar" idPrefix="sugar" {...p} />;
