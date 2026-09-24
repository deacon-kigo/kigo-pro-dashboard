import type { ComponentProps } from "react";

import { Label } from "@radix-ui/react-dropdown-menu";

import { cn } from "@/components/prod/utils/cn";

const DropdownMenuLabel = ({
  className,
  ...props
}: ComponentProps<typeof Label>) => (
  <Label
    className={cn("px-2 py-1.5 text-sm font-medium", className)}
    {...props}
  />
);

export { DropdownMenuLabel };
