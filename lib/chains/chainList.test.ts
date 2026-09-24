import { describe, expect, it } from "vitest";
import { parseCsv } from "./chainList";

describe("parseCsv", () => {
  it("handles quotes, commas in quotes, escaped quotes, and CRLF", () => {
    const rows = parseCsv('chain,slug,note\r\n"Wendy\'s",wendys,"a, b"\r\n"Say ""hi""",x,\r\n');
    expect(rows).toEqual([
      { chain: "Wendy's", slug: "wendys", note: "a, b" },
      { chain: 'Say "hi"', slug: "x", note: "" },
    ]);
  });
});
