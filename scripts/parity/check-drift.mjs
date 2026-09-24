/*
 * parity:check. Fails when any SOURCE file recorded in the manifest has changed
 * since the last sync, so a production release cannot silently outdate the copies.
 */
import fs from "node:fs";
import path from "node:path";

import { SOURCE, readManifest, sha256, sourceHead } from "./lib.mjs";

const manifest = readManifest();
const head = sourceHead();
const drifted = [];
const missing = [];

const check = (unitId, sourcePath, expected) => {
  const abs = path.join(SOURCE, sourcePath);
  if (!fs.existsSync(abs)) {
    missing.push({ unitId, sourcePath });
    return;
  }
  const actual = sha256(fs.readFileSync(abs));
  if (actual !== expected) drifted.push({ unitId, sourcePath });
};

for (const unit of manifest.units) {
  for (const file of unit.files)
    check(unit.id, file.sourcePath, file.sourceSha256);
}
for (const asset of manifest.assets)
  check("assets", asset.source, asset.sourceSha256);

const files =
  manifest.units.reduce((n, u) => n + u.files.length, 0) +
  manifest.assets.length;
console.log(
  `manifest synced at ${manifest.sourceCommit.slice(0, 8)}, SOURCE HEAD ${head.slice(0, 8)}, ${files} files checked`
);

if (drifted.length === 0 && missing.length === 0) {
  console.log("no drift");
  process.exit(0);
}

const byUnit = (rows) => [...new Set(rows.map((r) => r.unitId))].sort();
if (drifted.length > 0) {
  console.error(
    `\n${drifted.length} SOURCE file(s) changed since sync (units: ${byUnit(drifted).join(", ")}):`
  );
  for (const row of drifted)
    console.error(`  ${row.unitId.padEnd(14)} ${row.sourcePath}`);
}
if (missing.length > 0) {
  console.error(
    `\n${missing.length} SOURCE file(s) no longer exist (units: ${byUnit(missing).join(", ")}):`
  );
  for (const row of missing)
    console.error(`  ${row.unitId.padEnd(14)} ${row.sourcePath}`);
}
console.error("\nRun `npm run parity` to resync and re-verify.");
process.exit(1);
