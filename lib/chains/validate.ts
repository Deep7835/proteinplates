import { ChainSchema, type Chain } from "@/lib/schema/chain";

export type ValidationResult = { ok: true; chain: Chain } | { ok: false; errors: string[] };

/** Parses one chain file's text. Used by the site loader and by `npm run validate-data`. */
export function validateChainFile(fileName: string, text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }
  const parsed = ChainSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.length ? i.path.join(".") : "(root)"}: ${i.message}`),
    };
  }
  const expectedSlug = fileName.replace(/\.json$/, "");
  if (parsed.data.slug !== expectedSlug) {
    return { ok: false, errors: [`slug "${parsed.data.slug}" must match the file name "${expectedSlug}"`] };
  }
  return { ok: true, chain: parsed.data };
}
