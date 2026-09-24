import { EXAMPLE_DAYS, FOODS, type DayTemplate, type FoodId, type MealSlot } from "@/lib/config/example-foods";
import type { MealsPerDay } from "./protein";

export type ExampleItem = { label: string; proteinG: number };
export type ExampleMeal = { slot: MealSlot; name: string; items: ExampleItem[]; proteinG: number };
export type ExampleDay = { title: string; meals: ExampleMeal[]; totalProteinG: number };

const proteinPerUnit = (food: FoodId) => (FOODS[food].proteinPer100g * FOODS[food].gramsPerUnit) / 100;

export function portionLabel(food: FoodId, units: number): string {
  const f = FOODS[food];
  const grams = String(Math.round(f.gramsPerUnit * units));
  return (units === 1 ? f.one : f.many).replace("{n}", String(units)).replace("{g}", grams);
}

type Working = { template: DayTemplate["meals"][number]; units: number; sidesProtein: number };

const mealProtein = (m: Working) => m.sidesProtein + m.units * proteinPerUnit(m.template.main.food);

/**
 * Builds an example day inside [minG, maxG]:
 * 1. Size each meal's main protein food to hit (target / meals).
 * 2. Nudge portions up or down, one unit at a time, until the day total is in range
 *    (or no meal can change further). Extra protein goes to the smallest meal first.
 */
export function buildExampleDay(template: DayTemplate, target: { minG: number; maxG: number }, mealsPerDay: MealsPerDay): ExampleDay {
  const meals = template.meals.filter((m) => mealsPerDay === 4 || m.slot !== "snack");
  const perMeal = (target.minG + target.maxG) / 2 / meals.length;

  const working: Working[] = meals.map((t) => {
    const sidesProtein = t.sides.reduce((sum, s) => sum + s.units * proteinPerUnit(s.food), 0);
    const ideal = Math.round((perMeal - sidesProtein) / proteinPerUnit(t.main.food));
    const units = Math.min(t.main.maxUnits, Math.max(t.main.minUnits, ideal));
    return { template: t, units, sidesProtein };
  });

  const total = () => working.reduce((sum, m) => sum + mealProtein(m), 0);

  // Too low: add a unit to the smallest meal, preferring a step that doesn't overshoot the max.
  while (total() < target.minG) {
    const candidates = working.filter((m) => m.units < m.template.main.maxUnits).sort((a, b) => mealProtein(a) - mealProtein(b));
    if (candidates.length === 0) break;
    const pick = candidates.find((m) => total() + proteinPerUnit(m.template.main.food) <= target.maxG) ?? candidates[0];
    pick.units += 1;
  }
  // Too high: remove a unit from the largest meal, but never drop below the min.
  while (total() > target.maxG) {
    const candidates = working.filter((m) => m.units > m.template.main.minUnits).sort((a, b) => mealProtein(b) - mealProtein(a));
    const pick = candidates.find((m) => total() - proteinPerUnit(m.template.main.food) >= target.minG);
    if (!pick) break;
    pick.units -= 1;
  }

  const out: ExampleMeal[] = working.map((m) => {
    const main = m.template.main.food;
    const items: ExampleItem[] = [
      { label: portionLabel(main, m.units), proteinG: round1(m.units * proteinPerUnit(main)) },
      ...m.template.sides.map((s) => ({ label: portionLabel(s.food, s.units), proteinG: round1(s.units * proteinPerUnit(s.food)) })),
    ];
    return { slot: m.template.slot, name: m.template.name, items, proteinG: Math.round(mealProtein(m)) };
  });

  return { title: template.title, meals: out, totalProteinG: Math.round(total()) };
}

export function buildExampleDays(target: { minG: number; maxG: number }, mealsPerDay: MealsPerDay): ExampleDay[] {
  return EXAMPLE_DAYS.map((d) => buildExampleDay(d, target, mealsPerDay));
}

const round1 = (n: number) => Math.round(n * 10) / 10;
