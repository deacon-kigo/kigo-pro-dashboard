import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { Viewport } from "@radix-ui/react-toast";

import { cn } from "@/components/prod/utils/cn";

const ToastViewport = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Viewport> & {
  ref?: RefObject<ComponentRef<typeof Viewport>>;
}) => (
  <Viewport
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-1 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
      className
    )}
    ref={ref}
    {...props}
  />
);

export { ToastViewport };
