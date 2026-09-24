/*
 * Locates the mismatched pixels of one story and writes 4x zoomed crops of the
 * baseline, target and diff around them to scripts/parity/out/inspect/.
 *
 *   node scripts/parity/inspect-diff.mjs <storyId>
 */
import fs from "node:fs";
import path from "node:path";

import { PNG } from "pngjs";

import { OUT_DIR } from "./lib.mjs";

const id = process.argv[2];
if (!id) throw new Error("usage: inspect-diff.mjs <storyId>");

const dir = path.join(OUT_DIR, "stories");
const read = (suffix) =>
  PNG.sync.read(fs.readFileSync(path.join(dir, `${id}.${suffix}.png`)));
const base = read("baseline");
const target = read("target");

let minX = Infinity,
  minY = Infinity,
  maxX = -1,
  maxY = -1,
  count = 0;
const colors = new Map();
for (let y = 0; y < base.height; y += 1) {
  for (let x = 0; x < base.width; x += 1) {
    const i = (y * base.width + x) * 4;
    if (
      base.data[i] !== target.data[i] ||
      base.data[i + 1] !== target.data[i + 1] ||
      base.data[i + 2] !== target.data[i + 2] ||
      base.data[i + 3] !== target.data[i + 3]
    ) {
      count += 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      const key = `${[...base.data.subarray(i, i + 3)].join(",")} -> ${[...target.data.subarray(i, i + 3)].join(",")}`;
      colors.set(key, (colors.get(key) ?? 0) + 1);
    }
  }
}
console.log(
  `${id}: ${count} mismatched pixels, bbox x=${minX}..${maxX} y=${minY}..${maxY}`
);
console.log("top color deltas (baseline -> target):");
for (const [k, v] of [...colors.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8))
  console.log(`  ${String(v).padStart(6)}  ${k}`);
if (count === 0) process.exit(0);

const pad = 12,
  zoom = 4;
const x0 = Math.max(0, minX - pad),
  y0 = Math.max(0, minY - pad);
const x1 = Math.min(base.width - 1, maxX + pad),
  y1 = Math.min(base.height - 1, maxY + pad);
const w = x1 - x0 + 1,
  h = y1 - y0 + 1;
const crop = (png) => {
  const out = new PNG({ width: w * zoom, height: h * zoom });
  for (let y = 0; y < h * zoom; y += 1)
    for (let x = 0; x < w * zoom; x += 1) {
      const si =
        ((y0 + Math.floor(y / zoom)) * png.width +
          (x0 + Math.floor(x / zoom))) *
        4;
      const di = (y * w * zoom + x) * 4;
      png.data.copy(out.data, di, si, si + 4);
    }
  return PNG.sync.write(out);
};
const outDir = path.join(OUT_DIR, "inspect");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${id}.baseline.png`), crop(base));
fs.writeFileSync(path.join(outDir, `${id}.target.png`), crop(target));
console.log(
  `crops (${w}x${h} at ${zoom}x): ${path.relative(process.cwd(), outDir)}/${id}.{baseline,target}.png`
);
