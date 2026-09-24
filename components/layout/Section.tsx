import type { ReactNode } from "react";
import { Container } from "./Container";

type Props = {
  children: ReactNode;
  title?: string;
  intro?: string;
  id?: string;
  tone?: "plain" | "muted";
  className?: string;
};

export function Section({ children, title, intro, id, tone = "plain", className = "" }: Props) {
  return (
    <section id={id} className={`py-10 sm:py-14 ${tone === "muted" ? "bg-surface" : ""} ${className}`}>
      <Container>
        {title && <h2 className="text-2xl sm:text-3xl">{title}</h2>}
        {intro && <p className="mt-2 max-w-2xl text-muted">{intro}</p>}
        <div className={title || intro ? "mt-6" : ""}>{children}</div>
      </Container>
    </section>
  );
}
