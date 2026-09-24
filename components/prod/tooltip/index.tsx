"use client";

import type { ComponentProps, PropsWithChildren } from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { TooltipArrow } from "./atoms/tooltip-arrow";
import { TooltipContent } from "./atoms/tooltip-content";

interface TooltipProps {
  align?: ComponentProps<typeof TooltipContent>["align"];
  content: React.ReactNode;
  contentClassName?: string;
  isOpen?: boolean;
  onIsOpenChange?: ((isOpen: boolean) => void) | undefined;
  side?: ComponentProps<typeof TooltipContent>["side"];
  sideOffset?: ComponentProps<typeof TooltipContent>["sideOffset"];
}

const Tooltip = ({
  align = "center",
  children,
  content,
  contentClassName,
  isOpen,
  onIsOpenChange: handleIsOpenChange,
  side = "top",
  sideOffset,
  ...props
}: PropsWithChildren<TooltipProps>) => (
  // @ts-ignore - The fix for this seems to be to retype the Root Component's types, which doesn't seem to be worth the effort
  <TooltipPrimitive.Root onOpenChange={handleIsOpenChange} open={isOpen}>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipContent
      align={align}
      className={contentClassName}
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      {content}
      <TooltipArrow />
    </TooltipContent>
  </TooltipPrimitive.Root>
);

export { Tooltip };
