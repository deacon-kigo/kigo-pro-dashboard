import type * as React from "react";

import { cn } from "@/components/prod/utils/cn";

const BreadcrumbItem = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  ref?: React.Ref<HTMLLIElement>;
}) => (
  <li
    className={cn("inline-flex items-center gap-1.5", className)}
    ref={ref}
    {...props}
  />
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export { BreadcrumbItem };
