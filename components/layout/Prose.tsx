import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { longDate } from "@/lib/chains/format";

/** Simple text page layout for About, policies, and similar pages. */
export function ProsePage({ title, path, updated, children }: { title: string; path: string; updated?: string; children: ReactNode }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <article className="prose prose-slate dark:prose-invert prose-h1:font-semibold prose-h2:font-semibold mt-4 max-w-3xl prose-headings:tracking-tight prose-a:text-brand-700">
        <h1>{title}</h1>
        {updated && <p className="text-sm text-muted">Last updated {longDate(updated)}</p>}
        {children}
      </article>
    </Container>
  );
}
