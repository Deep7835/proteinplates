import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { longDate } from "@/lib/chains/format";
import { audiences } from "@/lib/config/site";
import { getAllGuides } from "@/lib/guides/load";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Protein Guides: Simple, Sourced Advice for Real Life",
  description:
    "Easy-to-read protein guides for GLP-1 users, gym-goers, and adults 50+. How much protein you need and how to get it from real food, at home or eating out.",
  path: "/guides",
});

export default function GuidesPage() {
  const guides = getAllGuides();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Protein guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Short, sourced guides on how much protein you need and how to get it from real food.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="flex h-full flex-col rounded-card border border-line p-5 text-ink no-underline shadow-card hover:border-brand-600"
            >
              <span className="flex flex-wrap gap-1.5">
                {g.audience.map((a) => (
                  <Badge key={a} tone="brand">{audiences.find((x) => x.slug === a)?.short}</Badge>
                ))}
              </span>
              <span className="mt-3 text-lg font-bold">{g.title}</span>
              <span className="mt-2 text-sm text-muted">{g.description}</span>
              <span className="mt-3 text-xs text-muted">Updated {longDate(g.updated)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
