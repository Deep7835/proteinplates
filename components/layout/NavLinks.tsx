"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/config/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Main navigation links with the current section marked (aria-current + underline bar). */
export function NavLinks({ links, variant }: { links: NavLink[]; variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <ul>
        {links.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-3 no-underline hover:bg-surface ${active ? "bg-brand-50 font-semibold text-brand-800" : "text-ink"}`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-1 text-sm font-medium">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-11 items-center rounded-full px-3 no-underline transition-colors duration-200 hover:bg-surface hover:text-brand-700 ${
                active ? "text-brand-700 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-brand-600" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
