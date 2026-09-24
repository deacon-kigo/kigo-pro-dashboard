import type { ComponentProps } from "react";

import { Content, Portal } from "@radix-ui/react-dropdown-menu";

import { cn } from "@/components/prod/utils/cn";

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Content>) => (
  <Portal>
    <Content
      className={cn(
        "bg-popover text-popover-foreground",
        "max-h-(--radix-dropdown-menu-content-available-height)",
        "z-50 min-w-[8rem] overflow-y-auto",
        "origin-(--radix-dropdown-menu-content-transform-origin)",
        "overflow-x-hidden rounded-md border p-1 shadow-md",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      sideOffset={sideOffset}
      {...props}
    />
  </Portal>
);

export { DropdownMenuContent };
