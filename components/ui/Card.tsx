import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-line bg-page p-5 shadow-card ${className}`}>{children}</div>;
}

/** Clickable card: lifts slightly on hover (no movement with reduced motion). */
export const cardLinkClass =
  "group flex h-full flex-col rounded-card border border-line bg-page text-ink no-underline shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0";
