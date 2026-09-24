import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { Title } from "@radix-ui/react-toast";

import { cn } from "@/components/prod/utils/cn";

const ToastTitle = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Title> & {
  ref?: RefObject<ComponentRef<typeof Title>>;
}) => (
  <Title
    className={cn("text-sm font-semibold", className)}
    ref={ref}
    {...props}
  />
);

export { ToastTitle };
