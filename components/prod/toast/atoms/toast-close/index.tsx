import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Close } from "@radix-ui/react-toast";

import { cn } from "@/components/prod/utils/cn";

const ToastClose = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Close> & {
  ref?: RefObject<ComponentRef<typeof Close>>;
}) => (
  <Close
    className={cn(
      "text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity",
      "group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400",
      "group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    ref={ref}
    {...props}
  >
    <XMarkIcon className="size-4" />
  </Close>
);

export { ToastClose };
