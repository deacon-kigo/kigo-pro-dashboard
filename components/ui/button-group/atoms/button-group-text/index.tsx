import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonGroupTextProps = ComponentProps<"div">;

const ButtonGroupText = ({ className, ...props }: ButtonGroupTextProps) => (
  <div
    className={cn(
      "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    data-testid="button-group-text"
    {...props}
  />
);

export { ButtonGroupText };
