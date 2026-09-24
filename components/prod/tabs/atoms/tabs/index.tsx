"use client";

import type { ComponentProps } from "react";

import { Root } from "@radix-ui/react-tabs";

import { cn } from "@/components/prod/utils/cn";

const Tabs = ({ className, ...props }: ComponentProps<typeof Root>) => (
  <Root className={cn("flex flex-col", className)} {...props} />
);

export { Tabs };
