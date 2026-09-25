import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "./Container";

type Props = {
  children: ReactNode;
  title?: string;
  /** Small label above the title, e.g. "Eat out". */
  eyebrow?: string;
  intro?: string;
  /** Link shown beside the title on wide screens and under the intro on phones, e.g. "View all guides". */
  action?: { href: string; label: string };
  id?: string;
  tone?: "plain" | "muted";
  className?: string;
};

export function Section({ children, title, eyebrow, intro, action, id, tone = "plain", className = "" }: Props) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${tone === "muted" ? "bg-surface" : ""} ${className}`}>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>}
            {title && <h2 className={`text-3xl sm:text-4xl ${eyebrow ? "mt-2" : ""}`}>{title}</h2>}
            {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
          </div>
          {action && (
            <Link
              href={action.href}
              className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start rounded-full font-semibold text-brand-700 no-underline sm:self-auto"
            >
              {action.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          )}
        </div>
        <div className={title || intro ? "mt-8" : ""}>{children}</div>
      </Container>
    </section>
  );
}
