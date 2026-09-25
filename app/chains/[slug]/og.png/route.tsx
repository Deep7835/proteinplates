import { ImageResponse } from "next/og";
import { monthYear } from "@/lib/chains/format";
import { getAllChains, getChain } from "@/lib/chains/load";
import { summaryPicks } from "@/lib/chains/rank";
import { site } from "@/lib/config/site";

// Share image for each chain (1200×630 PNG) at /chains/{slug}/og.png, built once at build time.
// Also used by the chain's item pages.
export const dynamic = "force-static";
export const dynamicParams = false;

const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return getAllChains().map((c) => ({ slug: c.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/chains/[slug]/og.png">) {
  const chain = getChain((await params).slug);
  const top = chain ? summaryPicks(chain).bestOverall : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#eef8f4", color: "#0a3329", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#115c48" }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 40, color: "#4f5b57" }}>Highest protein items at</div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>{chain?.chain ?? "Restaurant chains"}</div>
          {top && (
            <div style={{ display: "flex", marginTop: 28, fontSize: 40, padding: "16px 28px", background: "#ffffff", borderRadius: 20, alignSelf: "flex-start" }}>
              Top pick: {top.name} · <span style={{ fontWeight: 800, color: "#16735a", marginLeft: 12 }}>{top.protein_g} g protein</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4f5b57" }}>
          {chain ? `Official nutrition data · Updated ${monthYear(chain.data_checked_date)}` : site.tagline}
        </div>
      </div>
    ),
    size,
  );
}
