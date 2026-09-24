"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

/* Written by scripts/parity/build-css.mjs. Loaded as a static file, see that script's header. */
const PROD_CSS_HREF = "/pro/prod.css";

const ProCssReadyContext = createContext(false);

/*
 * Every production rule in prod.css is scoped under `.pro-root`. The class also
 * goes on <body> while a /pro page is mounted so Radix portals (tooltips,
 * dialogs, menus), which render as children of <body>, are styled too.
 */
const ProRoot = ({ children }: { children: ReactNode }) => {
  const [cssReady, setCssReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("pro-root");
    const link = document.querySelector<HTMLLinkElement>(
      `link[href="${PROD_CSS_HREF}"]`
    );
    if (link?.sheet) setCssReady(true);
    else
      link?.addEventListener("load", () => setCssReady(true), { once: true });
    return () => document.body.classList.remove("pro-root");
  }, []);

  return (
    <ProCssReadyContext.Provider value={cssReady}>
      <div className="pro-root">{children}</div>
    </ProCssReadyContext.Provider>
  );
};

export { ProCssReadyContext, ProRoot };
