import { buildSearchIndex } from "@/lib/search/index";

// Static JSON search index, built at build time and loaded only by the search page.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
