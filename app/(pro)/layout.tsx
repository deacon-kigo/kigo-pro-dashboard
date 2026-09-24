import type { ReactNode } from "react";

import { ProRoot } from "./pro-root";

export default function ProLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {/*
        Stylesheet lives in the server tree. A <link> inside the client ProRoot
        is hoisted to <head> on the server only, which shifts every useId
        (Radix menus, tabs, the search dropdown) and breaks hydration.
      */}
      <link href="/pro/prod.css" precedence="default" rel="stylesheet" />
      <ProRoot>{children}</ProRoot>
    </>
  );
}
