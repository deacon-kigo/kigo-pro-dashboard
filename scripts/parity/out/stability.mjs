import fs from "node:fs";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";
const FREEZE_CSS = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`;
const id = process.argv[2];
const n = Number(process.argv[3] ?? 4);
const b = await chromium.launch();
const shots = async (url, sel) => {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const ctx = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: "load" });
    await p.addStyleTag({ content: FREEZE_CSS });
    await p.waitForSelector(sel, { state: "attached" });
    const fontInfo = await p.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
      return [...document.fonts]
        .filter((f) => f.family.includes("Inter"))
        .map((f) => f.status)
        .join(",");
    });
    out.push({ png: PNG.sync.read(await p.screenshot()), fontInfo });
    await ctx.close();
  }
  return out;
};
const cmp = (a, b) =>
  pixelmatch(a.data, b.data, null, a.width, a.height, {
    threshold: 0,
    includeAA: true,
  });
for (const [name, url, sel] of [
  [
    "baseline",
    `http://localhost:6007/iframe.html?id=${id}&viewMode=story`,
    "#storybook-root > *",
  ],
  [
    "target",
    `http://localhost:3001/pro/__parity/${id}`,
    '[data-parity-ready="1"]',
  ],
]) {
  const s = await shots(url, sel);
  console.log(name, "fonts:", s.map((x) => x.fontInfo).join(" | "));
  console.log(
    name,
    "self-diffs vs first:",
    s
      .slice(1)
      .map((x) => cmp(s[0].png, x.png))
      .join(", ")
  );
}
await b.close();
