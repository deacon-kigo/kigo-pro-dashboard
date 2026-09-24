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
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  p.on(
    "console",
    (m) =>
      m.type() !== "log" && errs.push(m.type() + ": " + m.text().slice(0, 160))
  );
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
    const el = document.querySelector("[data-testid=glow-effect]");
    if (!el) return { glow: "MISSING" };
    const cs = getComputedStyle(el);
    return {
      inlineStyle: el.getAttribute("style"),
      cls: el.className,
      computed: {
        background: cs.backgroundImage.slice(0, 120),
        opacity: cs.opacity,
        transform: cs.transform,
        filter: cs.filter,
        zIndex: cs.zIndex,
        position: cs.position,
        inset: cs.inset,
        willChange: cs.willChange,
      },
      rect: el.getBoundingClientRect().toJSON(),
      animations: el.getAnimations().map((a) => ({
        type: a.constructor.name,
        state: a.playState,
        time: a.currentTime,
      })),
      docAnimations: document.getAnimations().length,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });
  console.log(
    "\n###",
    url,
    "\n",
    JSON.stringify(info, null, 1),
    "\n",
    errs.join("\n")
  );
  await ctx.close();
};
const id = "app-protected-components-header--admin";
await probe(
  `http://localhost:6007/iframe.html?id=${id}&viewMode=story`,
  "#storybook-root > *"
);
await probe(
  `http://localhost:3001/pro/__parity/${id}`,
  '[data-parity-ready="1"]'
);
await b.close();
