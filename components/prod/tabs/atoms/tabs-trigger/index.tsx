"use client";

import type { ComponentProps } from "react";

import { Trigger } from "@radix-ui/react-tabs";

import { cn } from "@/components/prod/utils/cn";

const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof Trigger>) => (
  <Trigger
    className={cn(
      "w-full",
      "inline-flex items-center justify-center rounded-sm whitespace-nowrap",
      "px-3 py-1.5 text-sm font-medium transition-all",
      "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-1 focus-visible:outline-none",
      "data-[state=active]:bg-white data-[state=active]:shadow-sm",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
);

export { TabsTrigger };
