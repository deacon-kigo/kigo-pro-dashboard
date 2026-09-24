import { chromium } from "playwright";
const b = await chromium.launch();
const FREEZE_CSS = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`;
const probe = async (url, sel) => {
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load" });
  await p.addStyleTag({ content: FREEZE_CSS });
  await p.waitForSelector(sel, { state: "attached", timeout: 20000 });
  await p.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
  });
  const info = await p.evaluate(() => {
    const pick = (el) => {
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: el.className.toString().slice(0, 100),
        font: cs.font,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        transform: cs.transform,
        rect: el.getBoundingClientRect().toJSON(),
        textRendering: cs.textRendering,
        fontSmoothing: cs.webkitFontSmoothing,
        fontKerning: cs.fontKerning,
        fontFeature: cs.fontFeatureSettings,
        fontVariant: cs.fontVariantNumeric,
      };
    };
    const label = [...document.querySelectorAll("p")].find((p) =>
      p.textContent.includes("Items per page")
    );
    const container = label?.parentElement;
    const single =
      container?.querySelector(
        '[class*="singleValue"], [class*="single-value"]'
      ) ??
      [...(container?.querySelectorAll("div") ?? [])].find(
        (d) => d.textContent.trim() === "5" && d.children.length === 0
      );
    const chain = [];
    let el = single;
    for (let i = 0; el && i < 2; i += 1) {
      chain.push(pick(el));
      el = el.parentElement;
    }
    return {
      fonts: [...document.fonts].map(
        (f) => `${f.family}/${f.weight}/${f.status}`
      ),
      chain,
    };
  });
  console.log("\n###", url, "\n", JSON.stringify(info, null, 1));
  await ctx.close();
};
const id = "components-data-table--default";
await probe(
  `http://localhost:6007/iframe.html?id=${id}&viewMode=story`,
  "#storybook-root > *"
);
await probe(
  `http://localhost:3001/pro/__parity/${id}`,
  '[data-parity-ready="1"]'
);
await b.close();
