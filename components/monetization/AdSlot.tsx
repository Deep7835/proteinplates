// Reserved ad space. Renders nothing unless NEXT_PUBLIC_ADS_ENABLED=true, so ads can be switched on
// later without code changes. The fixed min-height reserves space so the page doesn't shift (no CLS).

const HEIGHTS = {
  "after-intro": "min-h-[100px] sm:min-h-[90px]",
  "mid-content": "min-h-[250px]",
  "end-content": "min-h-[250px]",
} as const;

export type AdPosition = keyof typeof HEIGHTS;

export function AdSlot({ position }: { position: AdPosition }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  return (
    <div
      aria-hidden
      data-ad-position={position}
      className={`my-8 flex w-full print:hidden items-center justify-center rounded-card border border-dashed border-line bg-surface text-xs text-muted ${HEIGHTS[position]}`}
    >
      Advertisement
    </div>
  );
}
