import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cardLinkClass } from "@/components/ui/Card";

export type ChainCardData = {
  slug: string;
  name: string;
  country: string[];
  countryLabels: string[];
  category: string;
  categoryLabel: string;
  topPick: { name: string; protein: number } | null;
  glp1Menu: string | null;
};

/** Two-letter monogram, e.g. "Chick-fil-A" → "CF", "Subway" → "SU". We don't use chain logos (trademarks). */
function monogram(name: string) {
  const words = name.replace(/[^A-Za-z0-9 -]/g, "").split(/[\s-]+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

export function ChainCard({ chain }: { chain: ChainCardData }) {
  return (
    <Link href={`/chains/${chain.slug}`} className={`${cardLinkClass} p-5`}>
      <span className="flex items-start gap-3">
        <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-800 ring-1 ring-brand-200">
          {monogram(chain.name)}
        </span>
        <span className="min-w-0 flex-1 pt-0.5 text-lg font-bold leading-snug group-hover:text-brand-700">{chain.name}</span>
        <ArrowUpRight
          aria-hidden
          className="mt-1 size-5 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700 motion-reduce:transition-none"
        />
      </span>
      <span className="mt-3 flex flex-wrap gap-1.5">
        {chain.countryLabels.map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
        <Badge>{chain.categoryLabel}</Badge>
        {chain.glp1Menu && <Badge tone="accent">{chain.glp1Menu}</Badge>}
      </span>
      {chain.topPick && (
        <span className="mt-auto block pt-4">
          <span className="block rounded-xl bg-surface px-3 py-2 text-sm">
            <span className="block text-xs font-medium text-muted">Top pick</span>
            <span className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 text-ink">{chain.topPick.name}</span>
              <span className="shrink-0 font-semibold text-brand-700">{chain.topPick.protein} g</span>
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
