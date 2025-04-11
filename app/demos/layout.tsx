"use client";

import React from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
