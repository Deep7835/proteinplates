import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-800 ring-brand-200",
  accent: "bg-accent-50 text-accent-800 ring-accent-100",
  neutral: "bg-surface text-muted ring-line",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}
