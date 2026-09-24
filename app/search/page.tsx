import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SearchBox } from "@/components/search/SearchBox";

export const metadata: Metadata = {
  title: "Search",
  description: "Search calculators, guides, and restaurant chains.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-10">
      <h1 className="text-3xl sm:text-4xl">Search</h1>
      <div className="mt-6">
        <SearchBox />
      </div>
    </Container>
  );
}
