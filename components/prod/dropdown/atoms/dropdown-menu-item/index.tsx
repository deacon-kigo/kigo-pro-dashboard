import type { ComponentProps } from "react";

import { Item } from "@radix-ui/react-dropdown-menu";

import { cn } from "@/components/prod/utils/cn";

const DropdownMenuItem = ({
  className,
  ...props
}: ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      "relative flex cursor-pointer items-center gap-2",
      "focus:bg-accent focus:text-accent-foreground",
      "rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
);

export { DropdownMenuItem };
