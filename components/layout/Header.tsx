import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { mainNav } from "@/lib/config/site";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur print:static print:border-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-page focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Container className="flex h-16 items-center gap-2">
        <Logo />

        <nav aria-label="Main" className="ml-auto hidden lg:block print:hidden">
          <ul className="flex items-center gap-5 text-sm font-medium">
            {mainNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink no-underline hover:text-brand-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-3 print:hidden">
          <Link href="/search" className="flex size-11 items-center justify-center rounded-lg text-ink no-underline hover:bg-surface" aria-label="Search">
            <Search aria-hidden className="size-5" />
          </Link>
          <ThemeToggle />

          {/* Mobile menu: native <details>, no JavaScript needed. */}
          <details className="group relative lg:hidden">
            <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-line [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden className="size-5" />
              <span className="sr-only">Open menu</span>
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-60 rounded-card border border-line bg-page p-2 shadow-card">
              <ul>
                {mainNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-md px-3 py-3 text-ink no-underline hover:bg-surface">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
