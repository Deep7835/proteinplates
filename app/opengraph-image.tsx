import { ImageResponse } from "next/og";
import { site } from "@/lib/config/site";

// Default share image for pages that don't have their own.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
