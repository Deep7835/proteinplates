import Link from "next/link";
import { audiences, calculatorLinks, footerLinks, site } from "@/lib/config/site";
import { Container } from "./Container";
import { CookieSettingsButton } from "./CookieConsent";
import { Logo } from "./Logo";

function LinkList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink no-underline hover:text-brand-700 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface print:hidden">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">{site.tagline}</p>
        </div>
        <LinkList title="Calculators" links={calculatorLinks} />
        <LinkList
          title="Eat for your goal"
          links={audiences.map((a) => ({ href: `/for/${a.slug}`, label: a.label }))}
        />
        <LinkList title="About us" links={footerLinks} />
      </Container>
      <Container className="border-t border-line py-6 text-xs text-muted">
        <p>
          The info on this site is for education only. It is not medical advice. Talk to your doctor or a registered
          dietitian before you change your diet.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <Link href="/privacy" className="inline-flex min-h-11 items-center text-muted underline-offset-2 hover:text-brand-700 hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center text-muted underline-offset-2 hover:text-brand-700 hover:underline">
            Terms of use
          </Link>
          {site.googleAnalyticsId && (
            <CookieSettingsButton className="inline-flex min-h-11 cursor-pointer items-center text-muted underline-offset-2 hover:text-brand-700 hover:underline" />
          )}
        </p>
      </Container>
    </footer>
  );
}
