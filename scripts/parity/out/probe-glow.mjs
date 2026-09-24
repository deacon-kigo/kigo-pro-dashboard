import { chromium } from "playwright";
const b = await chromium.launch();
const probe = async (url, sel) => {
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) =>
    errors.push("pageerror: " + String(e).split("\n")[0])
  );
  p.on(
    "console",
    (m) =>
      (m.type() === "error" || m.type() === "warning") &&
      errors.push(m.type() + ": " + m.text().slice(0, 200))
  );
  await p.goto(url, { waitUntil: "load" });
  try {
    await p.waitForSelector(sel, { state: "attached", timeout: 15000 });
  } catch (e) {
    errors.push("READY TIMEOUT");
  }
  const info = await p.evaluate(() => {
    const glow = [...document.querySelectorAll("header div")]
      .filter((d) => /blur|pointer-events-none/.test(d.className))
      .map((d) => ({
        cls: d.className.slice(0, 120),
        style: d.getAttribute("style")?.slice(0, 200),
        rect: JSON.stringify(d.getBoundingClientRect()),
      }));
    return {
      glow,
      animations: document.getAnimations().length,
      ready: document
        .querySelector("[data-parity-ready]")
        ?.getAttribute("data-parity-ready"),
      rootChildren: document
        .querySelector("#storybook-root, [data-parity-ready]")
        ?.innerHTML.slice(0, 300),
    };
  });
  console.log(url, JSON.stringify(info, null, 1), errors.join("\n"));
  await ctx.close();
};
const id = process.argv[2];
await probe(
  `http://localhost:6007/iframe.html?id=${id}&viewMode=story`,
  "#storybook-root > *"
);
await probe(
  `http://localhost:3001/pro/__parity/${id}`,
  '[data-parity-ready="1"]'
);
await b.close();
