import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

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

export function ChainCard({ chain }: { chain: ChainCardData }) {
  return (
    <Link
      href={`/chains/${chain.slug}`}
      className="flex h-full flex-col rounded-card border border-line bg-page p-5 text-ink no-underline shadow-card transition-colors hover:border-brand-600"
    >
      <span className="text-lg font-bold">{chain.name}</span>
      <span className="mt-2 flex flex-wrap gap-1.5">
        {chain.countryLabels.map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
        <Badge>{chain.categoryLabel}</Badge>
        {chain.glp1Menu && <Badge tone="accent">{chain.glp1Menu}</Badge>}
      </span>
      {chain.topPick && (
        <span className="mt-3 text-sm text-muted">
          Top pick: <span className="text-ink">{chain.topPick.name}</span>{" "}
          <span className="font-semibold text-brand-700">({chain.topPick.protein} g)</span>
        </span>
      )}
    </Link>
  );
}
