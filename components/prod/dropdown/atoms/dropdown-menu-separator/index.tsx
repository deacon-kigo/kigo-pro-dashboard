import type { ComponentProps } from "react";

import { Separator } from "@radix-ui/react-dropdown-menu";

import { cn } from "@/components/prod/utils/cn";

const DropdownMenuSeparator = ({
  className,
  ...props
}: ComponentProps<typeof Separator>) => (
  <Separator
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props}
  />
);

export { DropdownMenuSeparator };
