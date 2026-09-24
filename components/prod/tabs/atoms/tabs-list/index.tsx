"use client";

import type { ComponentProps } from "react";

import { List } from "@radix-ui/react-tabs";

import { cn } from "@/components/prod/utils/cn";

const TabsList = ({ className, ...props }: ComponentProps<typeof List>) => (
  <List
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1",
      className
    )}
    {...props}
  />
);

export { TabsList };
