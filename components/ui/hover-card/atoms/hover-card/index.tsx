"use client";

import type { ComponentProps } from "react";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export type HoverCardProps = ComponentProps<typeof HoverCardPrimitive.Root>;

const HoverCard = ({ ...props }: HoverCardProps) => (
  <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
);

export { HoverCard };
