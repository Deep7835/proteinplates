import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/guides/GuideCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllGuides } from "@/lib/guides/load";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Nutrition Guides: Simple, Sourced Advice for Real Life",
  description:
    "Easy-to-read guides on protein, calories, carbs, fiber, water, and body measurements. Sourced advice for GLP-1 users, gym-goers, women, men, and adults 50+.",
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
      <h1 className="mt-4 text-4xl sm:text-5xl">Nutrition guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Short, sourced guides on protein, calories, and nutrients, and how to hit your targets with real food, at home or eating out.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g, i) => (
          <li key={g.slug}>
            <GuideCard guide={g} headingLevel="h2" eager={i === 0} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
