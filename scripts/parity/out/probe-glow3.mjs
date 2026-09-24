import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const p = await ctx.newPage();
const url =
  "http://localhost:3001/pro/__parity/app-protected-components-header--admin";
await p.goto(url, { waitUntil: "load" });
await p.waitForSelector('[data-parity-ready="1"]', {
  state: "attached",
  timeout: 20000,
});
for (const ms of [0, 250, 1000, 3000]) {
  await p.waitForTimeout(ms);
  const s = await p.evaluate(() =>
    document.querySelector("[data-testid=glow-effect]")?.getAttribute("style")
  );
  console.log(`+${ms}ms`, s);
}
const ctx2 = await b.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const p2 = await ctx2.newPage();
await p2.goto(url, { waitUntil: "load" });
await p2.waitForSelector('[data-parity-ready="1"]', {
  state: "attached",
  timeout: 20000,
});
await p2.waitForTimeout(500);
console.log(
  "no-reduce",
  await p2.evaluate(() =>
    document.querySelector("[data-testid=glow-effect]")?.getAttribute("style")
  )
);
await b.close();
