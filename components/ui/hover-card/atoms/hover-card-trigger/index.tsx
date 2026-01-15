"use client";

import type { ComponentProps } from "react";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export type HoverCardTriggerProps = ComponentProps<
  typeof HoverCardPrimitive.Trigger
>;

const HoverCardTrigger = ({ ...props }: HoverCardTriggerProps) => (
  <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
);

export { HoverCardTrigger };
