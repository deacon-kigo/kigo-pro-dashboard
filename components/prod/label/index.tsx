import type { ComponentPropsWithoutRef, ComponentRef } from "react";

import { Root as LabelRoot } from "@radix-ui/react-label";

import { cn } from "@/components/prod/utils/cn";

const Label = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof LabelRoot> & {
  ref?: React.Ref<ComponentRef<typeof LabelRoot>>;
}) => (
  <LabelRoot
    className={cn(
      "mb-1 inline-block text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    ref={ref}
    {...props}
  />
);

Label.displayName = LabelRoot.displayName;

export { Label };
