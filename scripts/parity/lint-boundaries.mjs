/*
 * Import boundary for the production copies. Files under components/prod and
 * app/(pro) may import only from components/prod, the /pro app itself, react,
 * next/*, and the packages the copied production files themselves import.
 * Anything else (the prototype's own components, lib, hooks, contexts, ...)
 * would mix stale prototype UI into the production shell.
 */
import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

import {
  PRO_APP_DIR,
  PROD_DIR,
  ROOT,
  listFiles,
  readManifest,
} from "./lib.mjs";

/*
 * Packages the copied production files import are allowed by definition; the
 * set is derived from the manifest's files, not maintained by hand. Only
 * react and next are allowed beyond that, for the shims and the /pro pages.
 */
const BASE_PACKAGES = new Set(["react", "react-dom", "next"]);

/*
 * Net-new modules that are built on the prod primitives and mounted inside the
 * /pro shell. They are not copies of production, so drift-check ignores them,
 * but the shell's route files are allowed to import them.
 */
const MOUNTED_FEATURES = ["@/components/features/john-deere/"];

const ALLOWED_ALIAS_PREFIXES = [
  "@/components/prod/",
  "@/app/(pro)/",
  ...MOUNTED_FEATURES,
];

const packageOf = (spec) =>
  spec.startsWith("@")
    ? spec.split("/").slice(0, 2).join("/")
    : spec.split("/")[0];

const copiedFiles = new Set(
  readManifest().units.flatMap((u) =>
    u.files.map((f) => path.join(ROOT, f.targetPath))
  )
);
const allowedPackages = new Set(BASE_PACKAGES);

const isAllowed = (spec, fromFile) => {
  if (spec.startsWith(".")) {
    const resolved = path.resolve(path.dirname(fromFile), spec);
    return resolved.startsWith(PROD_DIR) || resolved.startsWith(PRO_APP_DIR);
  }
  if (spec.startsWith("@/"))
    return ALLOWED_ALIAS_PREFIXES.some((p) => spec.startsWith(p));
  return allowedPackages.has(packageOf(spec));
};

const specifiers = (file) => {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );
  const found = [];
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      found.push({
        spec: node.moduleSpecifier.text,
        line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      found.push({
        spec: node.arguments[0].text,
        line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
};

const files = [...listFiles(PROD_DIR), ...listFiles(PRO_APP_DIR)].filter((f) =>
  /\.(ts|tsx|mts)$/.test(f)
);
const parsed = new Map(files.map((file) => [file, specifiers(file)]));
for (const file of files) {
  if (!copiedFiles.has(file)) continue;
  for (const { spec } of parsed.get(file)) {
    if (!spec.startsWith(".") && !spec.startsWith("@/"))
      allowedPackages.add(packageOf(spec));
  }
}

const violations = [];
for (const file of files) {
  for (const { spec, line } of parsed.get(file)) {
    if (!isAllowed(spec, file))
      violations.push({ file: path.relative(ROOT, file), line, spec });
  }
}

console.log(
  `${files.length} files under components/prod and app/(pro) checked; allowed packages: ${[...allowedPackages].sort().join(", ")}`
);
if (violations.length === 0) {
  console.log("no boundary violations");
  process.exit(0);
}
console.error(`\n${violations.length} import(s) cross the /pro boundary:`);
for (const v of violations) console.error(`  ${v.file}:${v.line}  '${v.spec}'`);
process.exit(1);
