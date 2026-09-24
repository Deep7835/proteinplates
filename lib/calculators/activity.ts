import { ACTIVITIES } from "@/lib/config/activities";

/** Calories burned ≈ MET × body weight (kg) × hours (Compendium of Physical Activities convention). */
export function caloriesBurned(input: { met: number; weightKg: number; minutes: number }): number {
  return Math.round(input.met * input.weightKg * (input.minutes / 60));
}

export function activityById(id: string) {
  return ACTIVITIES.find((a) => a.id === id);
}
