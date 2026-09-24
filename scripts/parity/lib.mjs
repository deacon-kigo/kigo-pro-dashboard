import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".."
);
const SOURCE = path.resolve(ROOT, "..", "kigo-admin-tools");
const PROD_DIR = path.join(ROOT, "components", "prod");
const PRO_APP_DIR = path.join(ROOT, "app", "(pro)");
const PROD_CSS = path.join(ROOT, "public", "pro", "prod.css");
const MANIFEST_PATH = path.join(ROOT, "scripts", "parity", "manifest.json");
const OUT_DIR = path.join(ROOT, "scripts", "parity", "out");
const STORYBOOK_URL =
  process.env.PARITY_STORYBOOK_URL ?? "http://localhost:6007";
const TARGET_URL = process.env.PARITY_TARGET_URL ?? "http://localhost:3001";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

const sourceHead = () =>
  execFileSync("git", ["-C", SOURCE, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();

const readManifest = () => JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

const writeManifest = (manifest) =>
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

const listFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));
};

export {
  MANIFEST_PATH,
  OUT_DIR,
  PRO_APP_DIR,
  PROD_CSS,
  PROD_DIR,
  ROOT,
  SOURCE,
  STORYBOOK_URL,
  TARGET_URL,
  listFiles,
  readManifest,
  sha256,
  sourceHead,
  writeManifest,
};
