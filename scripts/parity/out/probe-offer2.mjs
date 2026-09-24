import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const p = await ctx.newPage();
await p.goto("http://localhost:3001/offer-manager", { waitUntil: "load" });
await p.waitForTimeout(3000);
const info = await p.evaluate(() => ({
  fontsStatus: document.fonts.status,
  images: [...document.images]
    .map((img) => ({
      complete: img.complete,
      nw: img.naturalWidth,
      loading: img.loading,
      src: img.currentSrc.slice(0, 120),
    }))
    .filter((i) => !i.complete || i.nw === 0),
  total: document.images.length,
}));
console.log(JSON.stringify(info, null, 1));
await b.close();
