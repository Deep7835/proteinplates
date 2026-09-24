import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("reads h2/h3 headings, skips code blocks, and makes rehype-slug-compatible ids", () => {
    const md = "# Title\n## Why protein matters\ntext\n### Eggs & dairy\n```\n## not a heading\n```\n## Why protein matters";
    expect(extractToc(md)).toEqual([
      { id: "why-protein-matters", text: "Why protein matters", level: 2 },
      { id: "eggs--dairy", text: "Eggs & dairy", level: 3 },
      { id: "why-protein-matters-1", text: "Why protein matters", level: 2 },
    ]);
  });
});
