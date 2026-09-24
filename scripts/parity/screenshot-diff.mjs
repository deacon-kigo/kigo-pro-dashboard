/*
 * Pixel-diffs every story in the manifest against its /pro/__parity route.
 * Baseline = the production Storybook iframe, captured fresh each run.
 *
 *   node scripts/parity/screenshot-diff.mjs            all units
 *   node scripts/parity/screenshot-diff.mjs badge card  only these units
 *   node scripts/parity/screenshot-diff.mjs --leak before|after|diff
 *       screenshots the untouched prototype routes; `diff` compares before/after.
 */
import fs from "node:fs";
import path from "node:path";

import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

import { OUT_DIR, STORYBOOK_URL, TARGET_URL, readManifest } from "./lib.mjs";

const VIEWPORT = { width: 1440, height: 900 };

/*
 * Injected identically on both sides. Freezes motion, hides the blinking caret,
 * and hides the Next dev-only overlays (they have no Storybook counterpart).
 */
const FREEZE_CSS = `
*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
nextjs-portal, [data-nextjs-toast], [data-vercel-toolbar], vercel-live-feedback { display: none !important; }
`;

const LEAK_ROUTES = [
  "/campaign-manager/publisher-manager",
  "/merchants/v3",
  "/offer-manager",
];

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "_");

const newContext = async (browser) =>
  browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

const settle = async (page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? null
          : new Promise((r) => img.addEventListener("load", r, { once: true }))
      )
    );
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
  });
};

const capture = async (context, url, readySelector, file) => {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.waitForSelector(readySelector, {
    state: "attached",
    timeout: 30_000,
  });
  await settle(page);
  await page.screenshot({ path: file, fullPage: false });
  await page.close();
  return errors;
};

const readPng = (file) => PNG.sync.read(fs.readFileSync(file));

const diffPngs = (aFile, bFile, diffFile) => {
  const a = readPng(aFile);
  const b = readPng(bFile);
  if (a.width !== b.width || a.height !== b.height) {
    return {
      mismatched: Number.POSITIVE_INFINITY,
      total: a.width * a.height,
      sizeMismatch: true,
    };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0,
    includeAA: true,
  });
  if (mismatched > 0) fs.writeFileSync(diffFile, PNG.sync.write(diff));
  else if (fs.existsSync(diffFile)) fs.unlinkSync(diffFile);
  return { mismatched, total: a.width * a.height, sizeMismatch: false };
};

const runLeak = async (browser, mode) => {
  const dir = path.join(OUT_DIR, "leak");
  fs.mkdirSync(path.join(dir, "before"), { recursive: true });
  fs.mkdirSync(path.join(dir, "after"), { recursive: true });
  if (mode === "before" || mode === "after") {
    const context = await newContext(browser);
    for (const route of LEAK_ROUTES) {
      const file = path.join(dir, mode, `${slug(route)}.png`);
      await capture(context, `${TARGET_URL}${route}`, "body", file);
      console.log(`${mode} ${route} -> ${path.relative(process.cwd(), file)}`);
    }
    await context.close();
    return 0;
  }
  let failures = 0;
  for (const route of LEAK_ROUTES) {
    const name = `${slug(route)}.png`;
    const result = diffPngs(
      path.join(dir, "before", name),
      path.join(dir, "after", name),
      path.join(dir, `diff_${name}`)
    );
    const pct = ((result.mismatched / result.total) * 100).toFixed(4);
    console.log(
      `${result.mismatched === 0 ? "OK  " : "LEAK"} ${route} mismatched=${result.mismatched} (${pct}%)`
    );
    if (result.mismatched !== 0) failures += 1;
  }
  return failures;
};

const runStories = async (browser, unitFilter) => {
  const manifest = readManifest();
  const units = manifest.units.filter(
    (u) =>
      u.storyIds.length > 0 &&
      (unitFilter.length === 0 || unitFilter.includes(u.id))
  );
  const dir = path.join(OUT_DIR, "stories");
  fs.mkdirSync(dir, { recursive: true });
  const baselineCtx = await newContext(browser);
  const targetCtx = await newContext(browser);
  const report = [];
  for (const unit of units) {
    for (const id of unit.storyIds) {
      const baseFile = path.join(dir, `${id}.baseline.png`);
      const targetFile = path.join(dir, `${id}.target.png`);
      const diffFile = path.join(dir, `${id}.diff.png`);
      let row;
      try {
        const baseErrors = await capture(
          baselineCtx,
          `${STORYBOOK_URL}/iframe.html?id=${id}&viewMode=story`,
          "#storybook-root > *",
          baseFile
        );
        const targetErrors = await capture(
          targetCtx,
          `${TARGET_URL}/pro/__parity/${id}`,
          '[data-parity-ready="1"]',
          targetFile
        );
        const result = diffPngs(baseFile, targetFile, diffFile);
        row = { unit: unit.id, id, ...result, baseErrors, targetErrors };
      } catch (error) {
        row = {
          unit: unit.id,
          id,
          mismatched: Number.POSITIVE_INFINITY,
          total: 0,
          error: String(error),
        };
      }
      const pct = row.total
        ? ((row.mismatched / row.total) * 100).toFixed(4)
        : "n/a";
      const status = row.mismatched === 0 ? "OK  " : "DIFF";
      console.log(
        `${status} ${unit.id.padEnd(14)} ${id} mismatched=${row.mismatched} (${pct}%)` +
          (row.error ? ` error=${row.error.split("\n")[0]}` : "") +
          (row.mismatched > 0 && !row.error
            ? ` diff=${path.relative(process.cwd(), diffFile)}`
            : "")
      );
      report.push(row);
    }
  }
  await baselineCtx.close();
  await targetCtx.close();
  fs.writeFileSync(
    path.join(dir, "report.json"),
    `${JSON.stringify(report, null, 2)}\n`
  );
  const failures = report.filter((r) => r.mismatched !== 0).length;
  console.log(
    `\n${report.length - failures}/${report.length} stories at 0 mismatched pixels`
  );
  return failures;
};

const main = async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  try {
    const leakIndex = args.indexOf("--leak");
    const failures =
      leakIndex >= 0
        ? await runLeak(browser, args[leakIndex + 1])
        : await runStories(browser, args);
    process.exitCode = failures === 0 ? 0 : 1;
  } finally {
    await browser.close();
  }
};

await main();
