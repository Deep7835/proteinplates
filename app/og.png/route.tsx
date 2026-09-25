import { ImageResponse } from "next/og";
import { site } from "@/lib/config/site";

// Default share image (1200×630 PNG) at /og.png, built once at build time. A real .png URL, so static hosts
// send it with the right content type.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#115c48", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#a9dcc8" }}>{site.name}</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 84, fontWeight: 800, lineHeight: 1.1 }}>{site.tagline}</div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 36, color: "#d5eee4" }}>Free protein calculator · High-protein picks at US, UK, and Indian chains</div>
      </div>
    ),
    size,
  );
}
