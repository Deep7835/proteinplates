import Link from "next/link";
import { site } from "@/lib/config/site";

/** Plate mark: a green plate with a "P" in the middle. Same drawing as app/icon.svg. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="var(--color-brand-600)" />
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M13 21.5V10.5h4.2a3.6 3.6 0 0 1 0 7.2H13" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-ink no-underline" aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight">{site.name}</span>
    </Link>
  );
}
