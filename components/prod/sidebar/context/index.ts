"use client";

import { createContext } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
}

const SidebarContext = createContext<null | SidebarContextValue>(null);

export { SidebarContext };
