import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const InputGroup = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "group/input-group border-input relative flex w-full items-center rounded-md border transition-[color] outline-none",
      "h-10 min-w-0 has-[>textarea]:h-auto",

      // * Variants based on alignment.
      "has-[>[data-align=inline-start]]:[&>input]:pl-2",
      "has-[>[data-align=inline-end]]:[&>input]:pr-2",
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

      // * Focus state.
      "has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
      "has-[[data-slot=input-group-control]:focus-visible]:ring-1",

      // * Error state.
      "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive",

      className
    )}
    data-slot="input-group"
    data-testid="input-group"
    role="group"
    {...props}
  />
);

export { InputGroup };
