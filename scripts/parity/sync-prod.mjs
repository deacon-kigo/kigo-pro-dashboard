/*
 * parity:sync. Copies the production components listed in UNITS (and every
 * SOURCE module they import) into components/prod, applying only the transforms
 * named in TRANSFORMS, then writes scripts/parity/manifest.json and the
 * /pro/__parity story registry (app/(pro)/pro/%5F%5Fparity/registry.tsx). Rerun after every production release.
 *
 * Anything a copied file needs that is not covered by a declared transform is a
 * stop: the script exits non-zero and names the file. Never hand-edit a copy.
 */
import fs from "node:fs";
import path from "node:path";

import {
  MANIFEST_PATH,
  PRO_APP_DIR,
  PROD_DIR,
  ROOT,
  SOURCE,
  STORYBOOK_URL,
  listFiles,
  sha256,
  sourceHead,
  writeManifest,
} from "./lib.mjs";

/* Ported units. `entry` is a SOURCE module (dir or file) whose import closure is copied. */
const UNITS = [
  {
    id: "badge",
    entries: ["src/components/badge"],
    stories: "src/components/badge/badge.stories.tsx",
  },
  {
    id: "card",
    entries: ["src/components/card"],
    stories: "src/components/card/card.stories.tsx",
  },
  {
    id: "button",
    entries: ["src/components/button"],
    stories: "src/components/button/button.stories.tsx",
  },
  {
    id: "tooltip",
    entries: ["src/components/tooltip"],
    stories: "src/components/tooltip/tooltip.stories.tsx",
  },
  {
    id: "input",
    entries: ["src/components/input"],
    stories: "src/components/input/input.stories.tsx",
  },
  {
    id: "search-bar",
    entries: ["src/components/search-bar"],
    stories: "src/components/search-bar/search-bar.stories.tsx",
  },
  {
    id: "data-table",
    entries: ["src/components/data-table"],
    stories: "src/components/data-table/data-table.stories.tsx",
  },
  {
    id: "table",
    entries: ["src/components/table"],
    stories: "src/components/table/table.stories.tsx",
  },
  {
    id: "dialog",
    entries: ["src/components/dialog"],
    stories: "src/components/dialog/dialog.stories.tsx",
  },
  {
    id: "tabs",
    entries: ["src/components/tabs"],
    stories: "src/components/tabs/tabs.stories.tsx",
  },
  {
    id: "skeleton",
    entries: ["src/components/skeleton"],
    stories: "src/components/skeleton/skeleton.stories.tsx",
  },
  {
    id: "loader",
    entries: ["src/components/loader"],
    stories: "src/components/loader/loader.stories.tsx",
  },
  {
    id: "page-header",
    entries: ["src/app/(protected)/components/page-header"],
    stories:
      "src/app/(protected)/components/page-header/page-header.stories.tsx",
  },
  {
    id: "breadcrumbs",
    entries: [
      "src/app/(protected)/components/breadcrumbs",
      "src/app/(protected)/components/breadcrumbs/breadcrumb-context",
    ],
    stories:
      "src/app/(protected)/components/breadcrumbs/breadcrumbs.stories.tsx",
  },
  {
    id: "header",
    entries: ["src/app/(protected)/components/header"],
    stories: "src/app/(protected)/components/header/header.stories.tsx",
  },
  {
    id: "sidebar",
    entries: [
      "src/app/(protected)/components/sidebar",
      "src/app/(protected)/components/sidebar/utils/collapsed-groups",
    ],
    stories: "src/app/(protected)/components/sidebar/sidebar.stories.tsx",
  },
  { id: "copy-button", entries: ["src/components/copy-button"], stories: null },
  {
    id: "shell",
    entries: [],
    stories: "src/app/(protected)/components/app-shell.stories.tsx",
  },
  {
    id: "types",
    entries: ["env.d.ts", "src/types/tanstack-table.d.ts"],
    stories: null,
  },
];

/* Static files copied byte-for-byte outside components/prod. */
const ASSETS = [
  { source: "public/kigo-logo.svg", target: "public/kigo-logo.svg" },
  { source: "public/kigo-isotype.svg", target: "public/kigo-isotype.svg" },
];

/* The only edits a copy may carry. Each is recorded per file in the manifest. */
const TRANSFORMS = {
  importRewrite: "import-rewrite",
  cookiesNoop: "cookies-next-noop",
  serverActionNoop: "server-action-noop",
  reactUseShim: "react-use-shim",
  contextProvider: "context-provider",
  nextNavigationShim: "next-navigation-shim",
  nextLinkShim: "next-link-shim",
  dependencyPin: "dependency-pin",
  react18RefTypes: "react18-ref-types",
  tsExpectErrorToIgnore: "ts-expect-error-to-ignore",
};

/* External modules swapped for a runtime shim. */
const MODULE_SHIMS = {
  "cookies-next": {
    target: "@/components/prod/_runtime/cookies",
    transform: TRANSFORMS.cookiesNoop,
  },
  "next/navigation": {
    target: "@/components/prod/_runtime/navigation",
    transform: TRANSFORMS.nextNavigationShim,
  },
  "next/link": {
    target: "@/components/prod/_runtime/link",
    transform: TRANSFORMS.nextLinkShim,
  },
  /* Production's exact framer-motion, installed under an alias so the prototype keeps its own. */
  "framer-motion": {
    target: "framer-motion-prod",
    transform: TRANSFORMS.dependencyPin,
  },
};

/* Server actions replaced by a no-op with the same export names. Their closure is not copied. */
const SERVER_ACTION_STUBS = new Set([
  "src/app/actions/sign-out/index.ts",
  "src/app/(protected)/components/sidebar/components/feedback-dialog/actions/write-feedback/index.ts",
]);

const ALIAS_PREFIX = "@/components/prod/";
/* Serves /pro/__parity. Next treats a folder starting with `_` as private, so the underscores are URL-encoded. */
const PARITY_SEGMENT = "%5F%5Fparity";
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

const toPosix = (p) => p.split(path.sep).join("/");

const resolveSource = (spec, fromAbs) => {
  let base;
  if (spec.startsWith("@/common-actions/"))
    base = path.join(
      SOURCE,
      "src/app/actions",
      spec.slice("@/common-actions/".length)
    );
  else if (spec.startsWith("@/"))
    base = path.join(SOURCE, "src", spec.slice(2));
  else if (spec.startsWith("."))
    base = path.resolve(path.dirname(fromAbs), spec);
  else return null;
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS)
    if (fs.existsSync(base + ext)) return base + ext;
  throw new Error(
    `cannot resolve '${spec}' from ${path.relative(SOURCE, fromAbs)}`
  );
};

/* SOURCE-relative path -> components/prod-relative path. */
const mapPath = (rel) => {
  const protectedComponents = "src/app/(protected)/components/";
  if (rel.startsWith("src/components/"))
    return rel.slice("src/components/".length);
  if (rel.startsWith(protectedComponents)) {
    const rest = rel.slice(protectedComponents.length);
    return rest.includes("/") ? rest : `shell/${rest}`;
  }
  if (rel.startsWith("src/app/(protected)/"))
    return `shell/${rel.slice("src/app/(protected)/".length)}`;
  if (rel.startsWith("src/app/actions/"))
    return `actions/${rel.slice("src/app/actions/".length)}`;
  if (rel.startsWith("src/utils/"))
    return `utils/${rel.slice("src/utils/".length)}`;
  if (rel.startsWith("src/hooks/"))
    return `hooks/${rel.slice("src/hooks/".length)}`;
  if (rel.startsWith("src/constants/"))
    return `constants/${rel.slice("src/constants/".length)}`;
  if (rel.startsWith("src/types/"))
    return `types/${rel.slice("src/types/".length)}`;
  if (rel === "env.d.ts") return "types/env.d.ts";
  throw new Error(`no target mapping for SOURCE file ${rel}`);
};

const unitOf = (targetRel) => targetRel.split("/")[0];

const stripIndex = (p) =>
  p.replace(/\/index\.tsx?$/, "").replace(/\.tsx?$/, "");

const IMPORT_RE =
  /(^|\n)((?:import|export)\s+(?:type\s+)?(?:\*\s+as\s+[\w$]+|\*|\{[^}]*\}|[\w$]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+)(['"])([^'"]+)\3/g;
const BARE_IMPORT_RE = /(^|\n)(import\s+)(['"])([^'"]+)\3/g;
const DYNAMIC_IMPORT_RE = /(import\(\s*)(['"])([^'"]+)\2(\s*\))/g;

const specifierFor = (fromTargetAbs, toTargetRel, originalSpec) => {
  const toAbs = path.join(PROD_DIR, toTargetRel);
  if (originalSpec.startsWith(".")) {
    let rel = toPosix(path.relative(path.dirname(fromTargetAbs), toAbs));
    rel = stripIndex(rel);
    if (rel === "") rel = ".";
    else if (!rel.startsWith(".")) rel = `./${rel}`;
    const original = originalSpec.replace(/\/index$/, "");
    return rel === original || rel === `${original}/index` ? originalSpec : rel;
  }
  return `${ALIAS_PREFIX}${stripIndex(toTargetRel)}`;
};

const exportNames = (src) => {
  const names = new Set();
  for (const m of src.matchAll(/export\s+\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name && !name.startsWith("type ")) names.add(name);
    }
  }
  for (const m of src.matchAll(
    /export\s+(?:const|function|async function)\s+([\w$]+)/g
  ))
    names.add(m[1]);
  return [...names];
};

const stubServerAction = (sourceRel, src) => {
  const names = exportNames(src);
  if (names.length === 0)
    throw new Error(`no exports found to stub in ${sourceRel}`);
  const body = names
    .map(
      (n) => `const ${n} = async (..._args: unknown[]): Promise<void> => {};`
    )
    .join("\n");
  return `/* Generated by scripts/parity/sync-prod.mjs: server action replaced by a no-op. */\n${body}\n\nexport { ${names.join(", ")} };\n`;
};

const applyReactUseShim = (src) => {
  const re = /(^|\n)import\s+\{([^}]*)\}\s+from\s+(['"])react\3;?/;
  const m = src.match(re);
  if (!m || !/(^|[\s,])use(?=[\s,]|$)/.test(m[2])) return null;
  const names = m[2]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!names.includes("use")) return null;
  const kept = names.filter((n) => n !== "use");
  const shimImport = `import { use } from '${ALIAS_PREFIX}_runtime/react-use';`;
  const replacement =
    kept.length > 0
      ? `${m[1]}import { ${kept.join(", ")} } from 'react';\n${shimImport}`
      : `${m[1]}${shimImport}`;
  return src.replace(re, replacement);
};

const applyContextProvider = (src) => {
  const names = new Set(
    [...src.matchAll(/<([\w$]*Context)\s+value=/g)].map((m) => m[1])
  );
  if (names.size === 0) return null;
  let next = src;
  for (const name of names) {
    next = next
      .replace(new RegExp(`<${name}(\\s+value=)`, "g"), `<${name}.Provider$1`)
      .replace(new RegExp(`</${name}>`, "g"), `</${name}.Provider>`);
  }
  return next;
};

/*
 * Type-only edits for React 18's @types/react. React 19 types `ref` as
 * `RefObject<T | null>`; React 18's DOM elements accept `Ref<T>`. Runtime is untouched.
 */
const applyReact18RefTypes = (src) => {
  const marker = /React\.(?:RefObject|Ref)</g;
  let out = "";
  let cursor = 0;
  let m;
  while ((m = marker.exec(src))) {
    const argsStart = m.index + m[0].length;
    let depth = 1;
    let i = argsStart;
    while (i < src.length && depth > 0) {
      if (src[i] === "<") depth += 1;
      else if (src[i] === ">") depth -= 1;
      i += 1;
    }
    const args = src.slice(argsStart, i - 1);
    const members = [];
    let level = 0;
    let start = 0;
    for (let j = 0; j <= args.length; j += 1) {
      const ch = args[j];
      if (ch === "<" || ch === "(") level += 1;
      else if (ch === ">" || ch === ")") level -= 1;
      if ((ch === "|" && level === 0) || j === args.length) {
        members.push(args.slice(start, j).trim());
        start = j + 1;
      }
    }
    const kept = members.filter((member) => member !== "null");
    out += src.slice(cursor, m.index);
    out +=
      kept.length === members.length
        ? src.slice(m.index, i)
        : `React.Ref<${kept.join(" | ")}>`;
    cursor = i;
    marker.lastIndex = i;
  }
  out += src.slice(cursor);
  return out === src ? null : out;
};

/* A directive that expects a React 19 type error is unused (and itself an error) under React 18 types. */
const applyTsExpectErrorToIgnore = (src) => {
  const next = src.replace(/\/\/ @ts-expect-error/g, "// @ts-ignore");
  return next === src ? null : next;
};

const walk = (state, sourceAbs) => {
  const sourceRel = toPosix(path.relative(SOURCE, sourceAbs));
  if (state.files.has(sourceRel)) return;
  const targetRel = mapPath(sourceRel);
  const original = fs.readFileSync(sourceAbs);
  const entry = {
    sourcePath: sourceRel,
    targetPath: `components/prod/${targetRel}`,
    sourceSha256: sha256(original),
    transforms: [],
  };
  state.files.set(sourceRel, entry);

  if (SERVER_ACTION_STUBS.has(sourceRel)) {
    entry.transforms.push(TRANSFORMS.serverActionNoop);
    entry.content = stubServerAction(sourceRel, original.toString("utf8"));
    return;
  }

  let content = original.toString("utf8");
  const targetAbs = path.join(PROD_DIR, targetRel);
  const applied = new Set();
  const deps = [];

  const rewriteSpec = (spec) => {
    const shim = MODULE_SHIMS[spec];
    if (shim) {
      applied.add(shim.transform);
      return shim.target;
    }
    const resolved = resolveSource(spec, sourceAbs);
    if (resolved === null) return spec;
    deps.push(resolved);
    const depRel = toPosix(path.relative(SOURCE, resolved));
    const next = specifierFor(targetAbs, mapPath(depRel), spec);
    if (next !== spec) applied.add(TRANSFORMS.importRewrite);
    return next;
  };

  content = content.replace(
    IMPORT_RE,
    (all, lead, head, q, spec) => `${lead}${head}${q}${rewriteSpec(spec)}${q}`
  );
  content = content.replace(
    BARE_IMPORT_RE,
    (all, lead, head, q, spec) => `${lead}${head}${q}${rewriteSpec(spec)}${q}`
  );
  content = content.replace(
    DYNAMIC_IMPORT_RE,
    (all, head, q, spec, tail) => `${head}${q}${rewriteSpec(spec)}${q}${tail}`
  );

  const withUse = applyReactUseShim(content);
  if (withUse !== null) {
    content = withUse;
    applied.add(TRANSFORMS.reactUseShim);
  }
  const withProvider = applyContextProvider(content);
  if (withProvider !== null) {
    content = withProvider;
    applied.add(TRANSFORMS.contextProvider);
  }

  const withRefTypes = applyReact18RefTypes(content);
  if (withRefTypes !== null) {
    content = withRefTypes;
    applied.add(TRANSFORMS.react18RefTypes);
  }
  const withTsIgnore = applyTsExpectErrorToIgnore(content);
  if (withTsIgnore !== null) {
    content = withTsIgnore;
    applied.add(TRANSFORMS.tsExpectErrorToIgnore);
  }

  entry.transforms.push(...applied);
  entry.content = content;
  for (const dep of deps) walk(state, dep);
};

const fetchStoryIndex = async () => {
  const res = await fetch(`${STORYBOOK_URL}/index.json`);
  if (!res.ok)
    throw new Error(
      `Storybook index not reachable at ${STORYBOOK_URL}/index.json (${res.status})`
    );
  const index = await res.json();
  return Object.values(index.entries).filter((e) => e.type === "story");
};

/* Storybook's toId(): startCase(exportName) then sanitize(). */
const storyIdSuffix = (exportName) =>
  exportName
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const storiesForUnit = (unit, storyIndex, state) => {
  if (!unit.stories) return { storyIds: [], exports: [] };
  const importPath = `./${unit.stories}`;
  const entries = storyIndex.filter((e) => e.importPath === importPath);
  if (entries.length === 0)
    throw new Error(`no stories in Storybook index for ${importPath}`);
  const src = fs.readFileSync(path.join(SOURCE, unit.stories), "utf8");
  const names = [...src.matchAll(/^export const ([\w$]+)\s*[:=]/gm)].map(
    (m) => m[1]
  );
  const titleId = entries[0].id.split("--")[0];
  const exports = [];
  for (const name of names) {
    const id = `${titleId}--${storyIdSuffix(name)}`;
    if (!entries.some((e) => e.id === id))
      throw new Error(
        `export ${name} of ${unit.stories} does not match any Storybook id (expected ${id})`
      );
    exports.push({ id, exportName: name });
  }
  const missing = entries.filter((e) => !exports.some((x) => x.id === e.id));
  if (missing.length > 0)
    throw new Error(
      `Storybook ids without a matching export in ${unit.stories}: ${missing.map((e) => e.id).join(", ")}`
    );
  return {
    storyIds: exports.map((x) => x.id),
    exports,
    module: state.files.get(unit.stories).targetPath,
  };
};

const writeRegistry = (units) => {
  const lines = [
    "/* Generated by scripts/parity/sync-prod.mjs from scripts/parity/manifest.json. Do not edit. */",
    "import type { ParityStory } from './story-frame';",
    "",
  ];
  const entries = [];
  units.forEach((unit, i) => {
    if (!unit.registry) return;
    const alias = `stories${i}`;
    lines.push(
      `import * as ${alias} from '@/${stripIndex(unit.registry.module)}';`
    );
    for (const { id, exportName } of unit.registry.exports) {
      entries.push(
        `  '${id}': { meta: ${alias}.default, story: ${alias}.${exportName} },`
      );
    }
  });
  lines.push(
    "",
    "const registry: Record<string, ParityStory> = {",
    ...entries,
    "};",
    "",
    "export { registry };",
    ""
  );
  const file = path.join(PRO_APP_DIR, "pro", PARITY_SEGMENT, "registry.tsx");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join("\n"));
  return path.relative(ROOT, file);
};

const main = async () => {
  const storyIndex = await fetchStoryIndex();
  const state = { files: new Map() };
  for (const unit of UNITS) {
    for (const entry of unit.entries)
      walk(
        state,
        resolveSource(`./${entry}`, path.join(SOURCE, "package.json"))
      );
    if (unit.stories) walk(state, path.join(SOURCE, unit.stories));
  }

  const targets = new Map();
  for (const entry of state.files.values()) {
    if (targets.has(entry.targetPath))
      throw new Error(
        `target collision: ${entry.targetPath} from ${entry.sourcePath} and ${targets.get(entry.targetPath)}`
      );
    targets.set(entry.targetPath, entry.sourcePath);
  }

  /* Remove stale copies so a rerun converges on exactly the closure. */
  for (const file of listFiles(PROD_DIR)) {
    const rel = toPosix(path.relative(ROOT, file));
    if (rel.startsWith("components/prod/_runtime/")) continue;
    if (!targets.has(rel)) fs.unlinkSync(file);
  }
  for (const entry of state.files.values()) {
    const abs = path.join(ROOT, entry.targetPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, entry.content);
  }
  for (const asset of ASSETS) {
    const buf = fs.readFileSync(path.join(SOURCE, asset.source));
    fs.mkdirSync(path.dirname(path.join(ROOT, asset.target)), {
      recursive: true,
    });
    fs.writeFileSync(path.join(ROOT, asset.target), buf);
  }

  const byUnit = new Map();
  for (const entry of state.files.values()) {
    const id = unitOf(entry.targetPath.slice("components/prod/".length));
    if (!byUnit.has(id)) byUnit.set(id, []);
    byUnit.get(id).push(entry);
  }
  const declared = new Map(UNITS.map((u) => [u.id, u]));
  const orderedIds = [
    ...UNITS.map((u) => u.id),
    ...[...byUnit.keys()].filter((id) => !declared.has(id)).sort(),
  ];
  const units = orderedIds
    .filter((id) => byUnit.has(id))
    .map((id) => {
      const unit = declared.get(id) ?? { id, entries: [], stories: null };
      const stories = storiesForUnit(unit, storyIndex, state);
      const files = byUnit
        .get(id)
        .sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
      return {
        id,
        declared: declared.has(id),
        storyIds: stories.storyIds,
        files: files.map(
          ({ sourcePath, targetPath, sourceSha256, transforms }) => ({
            sourcePath,
            targetPath,
            sourceSha256,
            transforms,
          })
        ),
        registry:
          stories.exports.length > 0
            ? { module: stories.module, exports: stories.exports }
            : undefined,
      };
    });

  const manifest = {
    sourceRepo: path.relative(ROOT, SOURCE),
    sourceCommit: sourceHead(),
    generatedBy: "scripts/parity/sync-prod.mjs",
    transforms: Object.values(TRANSFORMS),
    assets: ASSETS.map((a) => ({
      ...a,
      sourceSha256: sha256(fs.readFileSync(path.join(SOURCE, a.source))),
    })),
    units: units.map(({ registry, ...unit }) => unit),
  };
  writeManifest(manifest);
  const registryFile = writeRegistry(units);

  const totalFiles = units.reduce((n, u) => n + u.files.length, 0);
  const totalStories = units.reduce((n, u) => n + u.storyIds.length, 0);
  console.log(
    `source ${manifest.sourceCommit.slice(0, 8)}: ${units.length} units, ${totalFiles} files, ${totalStories} stories -> ${path.relative(ROOT, MANIFEST_PATH)}, ${registryFile}`
  );
  for (const unit of units) {
    const kinds = new Set(unit.files.flatMap((f) => f.transforms));
    console.log(
      `  ${unit.id.padEnd(14)} files=${String(unit.files.length).padStart(3)} stories=${String(unit.storyIds.length).padStart(3)} transforms=${[...kinds].join(",") || "-"}`
    );
  }
};

await main();
