"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { RadioGroup } from "@/components/calculators/fields/RadioGroup";
import { ChainCard, type ChainCardData } from "./ChainCard";

type Country = "all" | "US" | "UK" | "IN";

/** All chains are in the server HTML; filters only hide cards in the browser. */
export function ChainFilters({ chains, categories }: { chains: ChainCardData[]; categories: { value: string; label: string }[] }) {
  const [country, setCountry] = useState<Country>("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chains.filter(
      (c) =>
        (country === "all" || c.country.includes(country)) &&
        (category === "all" || c.category === category) &&
        (q === "" || c.name.toLowerCase().includes(q)),
    );
  }, [chains, country, category, query]);

  return (
    <div>
      <div className="grid gap-4 rounded-card border border-line bg-surface p-4 sm:grid-cols-3">
        <div>
          <label htmlFor="chain-search" className="mb-1.5 block text-sm font-medium">Search</label>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="chain-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Chipotle"
              className="h-11 w-full rounded-lg border border-line bg-page pl-9 pr-3 text-base"
            />
          </div>
        </div>
        <RadioGroup<Country>
          legend="Country"
          name="chain-country"
          value={country}
          options={[
            { value: "all", label: "All" },
            { value: "US", label: "US" },
            { value: "UK", label: "UK" },
            { value: "IN", label: "India" },
          ]}
          onChange={setCountry}
        />
        <div>
          <label htmlFor="chain-category" className="mb-1.5 block text-sm font-medium">Type of food</label>
          <select
            id="chain-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-page px-3 text-base"
          >
            <option value="all">All types</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" className="mt-4 text-sm text-muted">
        Showing {visible.length} of {chains.length} chains
      </p>
      {visible.length > 0 ? (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <li key={c.slug}>
              <ChainCard chain={c} />
            </li>
          ))}
        </ul>
      ) : country !== "all" && !chains.some((c) => c.country.includes(country)) ? (
        <p className="mt-6 text-center text-muted">
          We’re adding {country === "IN" ? "Indian" : country} chains now. Check back soon.
        </p>
      ) : (
        <p className="mt-6 text-center text-muted">No chains match. Try a different search or filter.</p>
      )}
    </div>
  );
}
