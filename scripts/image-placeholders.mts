// npm run images
// For every photo in public/images:
// 1. Resized WebP copies at the widths the site uses (public/images/w/...), so pages can serve the right size
//    without a server. The site is a static export, so there is no on-the-fly image optimizer.
// 2. A tiny blurred preview (about 1 KB) saved to lib/images/placeholders.json, shown while the photo loads.
// Runs automatically before every build (see "prebuild" in package.json). Resized files are regenerated only
// when the source photo is newer, and are not committed (see .gitignore).

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_WIDTHS, variantPath } from "../lib/images/variants";

const PUBLIC = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), "lib", "images", "placeholders.json");
const GENERATED_DIR = path.join(PUBLIC, "images", "w");

function photos(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (full === GENERATED_DIR) return [];
    if (statSync(full).isDirectory()) return photos(full);
    return /\.(jpe?g|png|webp)$/i.test(name) ? [full] : [];
  });
}

const placeholders: Record<string, string> = {};
let made = 0;
for (const file of photos(path.join(PUBLIC, "images")).sort()) {
  const src = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  const sourceTime = statSync(file).mtimeMs;
  for (const width of IMAGE_WIDTHS) {
    const target = path.join(PUBLIC, variantPath(src, width));
    if (existsSync(target) && statSync(target).mtimeMs >= sourceTime) continue;
    mkdirSync(path.dirname(target), { recursive: true });
    await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target);
    made++;
  }
  const buf = await sharp(file).resize(24).webp({ quality: 40 }).toBuffer();
  placeholders[src] = `data:image/webp;base64,${buf.toString("base64")}`;
}
writeFileSync(OUT, JSON.stringify(placeholders, null, 2) + "\n");
console.log(`✓ ${Object.keys(placeholders).length} photos: ${made} resized copies made, placeholders written to lib/images/placeholders.json`);
