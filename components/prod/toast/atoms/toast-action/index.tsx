import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { Action } from "@radix-ui/react-toast";

import { cn } from "@/components/prod/utils/cn";

const ToastAction = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Action> & {
  ref?: RefObject<ComponentRef<typeof Action>>;
}) => (
  <Action
    className={cn(
      "bg-background text-foreground inline-flex h-8 shrink-0 items-center",
      "justify-center rounded-md border px-3 text-sm font-medium",
      "ring-offset-background hover:border-foreground focus:ring-ring",
      "transition-all hover:brightness-[97.5%] focus:ring-2 focus:ring-offset-2 focus:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
);

export { ToastAction };
