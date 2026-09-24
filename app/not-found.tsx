import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">We can’t find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        The link may be old, or the page may have moved. Try one of these instead.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
        <LinkButton href="/chains" variant="secondary">Restaurant chains</LinkButton>
        <LinkButton href="/guides" variant="ghost">Guides</LinkButton>
      </div>
    </Container>
  );
}
