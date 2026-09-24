// npm run images
// Makes a tiny blurred preview (about 1 KB) of every photo in public/images and saves them to
// lib/images/placeholders.json. Cards and cover photos show the preview instantly while the full image loads.
// Runs automatically before every build (see "prebuild" in package.json).

import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), "lib", "images", "placeholders.json");

function photos(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return photos(full);
    return /\.(jpe?g|png|webp)$/i.test(name) ? [full] : [];
  });
}

const result: Record<string, string> = {};
for (const file of photos(path.join(PUBLIC, "images")).sort()) {
  const buf = await sharp(file).resize(24).webp({ quality: 40 }).toBuffer();
  result["/" + path.relative(PUBLIC, file).split(path.sep).join("/")] = `data:image/webp;base64,${buf.toString("base64")}`;
}
writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`✓ ${Object.keys(result).length} image placeholders written to lib/images/placeholders.json`);
