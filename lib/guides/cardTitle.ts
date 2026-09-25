/**
 * Short headline for cards: the part of a guide title before its first "?" or ":", without a trailing "(...)".
 * "How Many Carbs on Keto? Your Daily Limit, Explained" → "How Many Carbs on Keto?"
 * "Protein on Ozempic: What to Eat to Keep Your Muscle" → "Protein on Ozempic"
 * "How to Calculate a Calorie Deficit (Step-by-Step, With Real Math)" → "How to Calculate a Calorie Deficit"
 * If the first part would be too short to stand alone, the full title is kept.
 */
export function cardTitle(title: string): string {
  const base = title.replace(/\s*\([^)]*\)\s*$/, "");
  const m = base.match(/^(.+?)([?:])\s+\S/);
  if (!m || m[1].length < 8) return base;
  return m[2] === "?" ? `${m[1]}?` : m[1];
}

/** URL/attribute-safe id for a topic, e.g. "Carbs & fat" → "carbs-fat". */
export function topicId(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
