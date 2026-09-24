import type { ComponentProps } from "react";

import { CollapsibleTrigger as CollapsibleTriggerPrimitive } from "@radix-ui/react-collapsible";

import { cn } from "@/components/prod/utils/cn";

interface CollapsibleTriggerProps extends ComponentProps<
  typeof CollapsibleTriggerPrimitive
> {}

const CollapsibleTrigger = ({
  className,
  ...props
}: CollapsibleTriggerProps) => (
  <CollapsibleTriggerPrimitive
    {...props}
    className={cn("group/collapsible-trigger", className)}
  />
);

export { CollapsibleTrigger };
