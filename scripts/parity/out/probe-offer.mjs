import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const p = await ctx.newPage();
const pending = new Map();
p.on("request", (r) => pending.set(r.url(), Date.now()));
p.on("requestfinished", (r) => pending.delete(r.url()));
p.on("requestfailed", (r) => pending.delete(r.url()));
let loaded = false;
p.on("load", () => {
  loaded = true;
  console.log("load fired at", Date.now() - t0, "ms");
});
const t0 = Date.now();
await p.goto("http://localhost:3001/offer-manager", { waitUntil: "commit" });
for (let i = 0; i < 4; i += 1) {
  await p.waitForTimeout(5000);
  console.log(
    `t+${(Date.now() - t0) / 1000}s loaded=${loaded} pending=${pending.size}`
  );
  for (const [u, t] of pending)
    console.log(
      "   ",
      Math.round((Date.now() - t) / 1000) + "s",
      u.slice(0, 140)
    );
  if (loaded) break;
}
await b.close();
