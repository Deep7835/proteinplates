import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Pill buttons with a short press animation (skipped when the user prefers reduced motion).
const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.97] motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
const variants: Record<Variant, string> = {
  primary: "bg-brand-700 text-page shadow-card hover:bg-brand-800 hover:shadow-lift",
  secondary: "border border-line bg-page text-ink hover:border-brand-600 hover:text-brand-700",
  ghost: "text-brand-700 hover:bg-brand-50",
};

/** Small pill link, e.g. "popular searches" and "other versions" lists. */
export const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-line bg-page px-4 text-sm text-ink no-underline transition-colors duration-200 hover:border-brand-600 hover:text-brand-700";

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type LinkButtonProps = { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
>;

export function LinkButton({ href, variant = "primary", className = "", children, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = { variant?: Variant } & ComponentProps<"button">;

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
