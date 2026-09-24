import type { ReactNode } from "react";
import { Container } from "./Container";

type Props = {
  children: ReactNode;
  title?: string;
  /** Small label above the title, e.g. "Eat out". */
  eyebrow?: string;
  intro?: string;
  id?: string;
  tone?: "plain" | "muted";
  className?: string;
};

export function Section({ children, title, eyebrow, intro, id, tone = "plain", className = "" }: Props) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${tone === "muted" ? "bg-surface" : ""} ${className}`}>
      <Container>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>}
        {title && <h2 className={`text-3xl sm:text-4xl ${eyebrow ? "mt-2" : ""}`}>{title}</h2>}
        {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
        <div className={title || intro ? "mt-6" : ""}>{children}</div>
      </Container>
    </section>
  );
}
