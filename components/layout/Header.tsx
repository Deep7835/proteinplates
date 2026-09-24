import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { mainNav } from "@/lib/config/site";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md print:static print:border-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-page focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Container className="flex h-16 items-center gap-2">
        <Logo />

        <nav aria-label="Main" className="ml-auto hidden lg:block print:hidden">
          <NavLinks links={mainNav} variant="desktop" />
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-3 print:hidden">
          <Link href="/search" className="flex size-11 items-center justify-center rounded-full text-ink no-underline transition-colors hover:bg-surface" aria-label="Search">
            <Search aria-hidden className="size-5" />
          </Link>
          <ThemeToggle />

          {/* Mobile menu: native <details>, no JavaScript needed. */}
          <details className="group relative lg:hidden">
            <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden className="size-5" />
              <span className="sr-only">Open menu</span>
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-64 rounded-card border border-line bg-page p-2 shadow-lift motion-safe:animate-fade-up">
              <NavLinks links={mainNav} variant="mobile" />
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
