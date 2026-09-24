"use client";

import type { ComponentProps } from "react";

import { Content } from "@radix-ui/react-tabs";

import { cn } from "@/components/prod/utils/cn";

const TabsContent = ({
  className,
  ...props
}: ComponentProps<typeof Content>) => (
  <Content className={cn("flex-1 outline-none", className)} {...props} />
);

export { TabsContent };
