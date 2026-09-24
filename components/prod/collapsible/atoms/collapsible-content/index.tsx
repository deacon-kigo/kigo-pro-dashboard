import { CollapsibleContent as CollapsibleContentPrimitive } from "@radix-ui/react-collapsible";

import { cn } from "@/components/prod/utils/cn";

const CollapsibleContent = ({
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleContentPrimitive>) => (
  <CollapsibleContentPrimitive
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-collapsible-slide-down",
      "data-[state=closed]:animate-collapsible-slide-up",
      className
    )}
    data-testid="collapsible-content"
    {...props}
  />
);

export { CollapsibleContent };
