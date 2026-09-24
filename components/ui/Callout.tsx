import type { ReactNode } from "react";
import { Info, TriangleAlert } from "lucide-react";

type Tone = "info" | "warn";

export function Callout({ children, title, tone = "info" }: { children: ReactNode; title?: string; tone?: Tone }) {
  const Icon = tone === "warn" ? TriangleAlert : Info;
  const styles = tone === "warn" ? "border-warn-800/20 bg-warn-50 text-warn-800" : "border-brand-200 bg-brand-50 text-brand-900";
  return (
    <div className={`flex gap-3 rounded-card border p-4 text-sm ${styles}`}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}
