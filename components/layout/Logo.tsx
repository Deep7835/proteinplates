import Link from "next/link";
import { site } from "@/lib/config/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-ink no-underline" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="var(--color-brand-600)" />
        <circle cx="16" cy="16" r="9" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M16 10v6l4 3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      <span className="text-lg tracking-tight">{site.name}</span>
    </Link>
  );
}
