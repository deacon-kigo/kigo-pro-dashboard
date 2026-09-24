"use client";

import { use } from "@/components/prod/_runtime/react-use";

import { SidebarContext } from "../../context";

const useSidebarContext = () => {
  const context = use(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a <SidebarContext> provider"
    );
  }

  return context;
};

export { useSidebarContext };
