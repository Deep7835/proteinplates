import { ExternalLink } from "lucide-react";

type Props = {
  product: string;
  /** One line on why it's useful. */
  reason: string;
  href: string;
  cta?: string;
};

/** Clearly labeled affiliate recommendation. Links use rel="sponsored nofollow". */
export function AffiliateBox({ product, reason, href, cta = "View product" }: Props) {
  return (
    <aside className="not-prose my-6 rounded-card border border-line bg-page p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Affiliate link</p>
      <p className="mt-1 text-lg font-bold">{product}</p>
      <p className="mt-1 text-muted">{reason}</p>
      <a
        href={href}
        rel="sponsored nofollow noopener"
        target="_blank"
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-page no-underline hover:bg-brand-800"
      >
        {cta} <ExternalLink aria-hidden className="size-4" />
      </a>
      <p className="mt-2 text-xs text-muted">We may earn a commission if you buy through this link, at no extra cost to you.</p>
    </aside>
  );
}
