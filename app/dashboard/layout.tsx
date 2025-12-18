"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";

/**
 * Layout for all dashboard pages
 *
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppSelector((state) => state.demo);

  return (
    <div
      style={
        {
          "--primary-color": theme.primaryColor,
          "--secondary-color": theme.secondaryColor,
          "--accent-color": theme.accentColor,
          "--background-color": theme.backgroundColor,
          "--text-color": theme.textColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
