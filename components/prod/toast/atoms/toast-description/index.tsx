import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { Description } from "@radix-ui/react-toast";

import { cn } from "@/components/prod/utils/cn";

const ToastDescription = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Description> & {
  ref?: RefObject<ComponentRef<typeof Description>>;
}) => <Description className={cn("text-sm", className)} ref={ref} {...props} />;

export { ToastDescription };
