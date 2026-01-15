import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const InputGroupText = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={cn(
      "text-muted-foreground flex items-center gap-2 text-sm",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

export { InputGroupText };
