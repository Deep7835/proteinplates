import { WEIGHT_LOSS_MILESTONES_PCT } from "@/lib/config/guidelines";

/** Percent of starting weight lost (negative = gained). Works in any unit. */
export function weightLossPercent(start: number, current: number) {
  const lost = start - current;
  const pct = Math.round((lost / start) * 1000) / 10;
  const next = WEIGHT_LOSS_MILESTONES_PCT.find((m) => pct < m) ?? null;
  return {
    lost: Math.round(lost * 10) / 10,
    percent: pct,
    reached: WEIGHT_LOSS_MILESTONES_PCT.filter((m) => pct >= m),
    next: next === null ? null : { percent: next, weightAt: Math.round(start * (1 - next / 100) * 10) / 10 },
  };
}
