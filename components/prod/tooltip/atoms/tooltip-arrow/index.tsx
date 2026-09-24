import type { ComponentPropsWithoutRef, ComponentRef } from "react";

import { Arrow } from "@radix-ui/react-tooltip";

import { cn } from "@/components/prod/utils/cn";

const TooltipArrow = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Arrow> & {
  ref?: React.Ref<ComponentRef<typeof Arrow>>;
}) => (
  <Arrow
    className={cn("fill-gray-900", className)}
    data-testid="tooltip-arrow"
    height={5}
    ref={ref}
    width={11}
    {...props}
  />
);

TooltipArrow.displayName = Arrow.displayName;

export { TooltipArrow };
