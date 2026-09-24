import { describe, expect, it } from "vitest";
import type { SearchDoc } from "./index";
import { searchDocs } from "./match";

const docs: SearchDoc[] = [
  { u: "/protein-calculator", t: "Protein Calculator", d: "How much protein you need", k: "Calculator", x: "" },
  { u: "/protein-calculator/for-women", t: "Protein Calculator for Women", d: "For women", k: "Calculator", x: "" },
  { u: "/chains/chick-fil-a", t: "Chick-fil-A high-protein menu", d: "US", k: "Chain", x: "12 ct Grilled Nuggets" },
  { u: "/guides/how-much-fiber-per-day", t: "How Much Fiber Per Day", d: "Fiber guide", k: "Guide", x: "fiber" },
];

describe("searchDocs", () => {
  it("ranks title matches first and requires every word", () => {
    expect(searchDocs(docs, "protein calculator").map((d) => d.u)).toEqual(["/protein-calculator", "/protein-calculator/for-women"]);
    expect(searchDocs(docs, "protein women").map((d) => d.u)).toEqual(["/protein-calculator/for-women"]);
  });
  it("finds chains by menu item and ignores case/punctuation", () => {
    expect(searchDocs(docs, "GRILLED nuggets!")[0].u).toBe("/chains/chick-fil-a");
    expect(searchDocs(docs, "chick fil a")[0].u).toBe("/chains/chick-fil-a");
  });
  it("returns nothing for an empty query", () => expect(searchDocs(docs, "  ")).toEqual([]));
});
