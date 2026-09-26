import Link from "next/link";
import { site } from "@/lib/config/site";

/**
 * Plate mark: a plate seen from above with one wedge highlighted, i.e. your protein portion per meal.
 * Same drawing as app/icon.svg, app/apple-icon.png, and public/logo*.svg; change them together.
 */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15.5" fill="var(--color-brand-600)" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#fff" strokeWidth="1.7" strokeOpacity="0.92" />
      <circle cx="16" cy="16" r="7.4" fill="#fff" fillOpacity="0.2" />
      <path d="M16 16V8.6A7.4 7.4 0 0 1 23.4 16Z" fill="var(--color-accent-400)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 text-ink no-underline" aria-label={`${site.name} home`}>
      <LogoMark />
      {/* On very narrow phones (under 360px) the name stacks on two lines so the header buttons keep their 44px size. */}
      <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight max-[359px]:flex max-[359px]:flex-col max-[359px]:text-[15px] max-[359px]:leading-[1.05] sm:text-xl">
        <span>Protein </span>
        <span className="text-brand-700">Per Meal</span>
      </span>
    </Link>
  );
}
