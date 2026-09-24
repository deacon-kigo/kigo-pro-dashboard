import type * as React from "react";

import { cn } from "@/components/prod/utils/cn";

const BreadcrumbList = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"ol"> & {
  ref?: React.Ref<HTMLOListElement>;
}) => (
  <ol
    className={cn(
      "flex flex-wrap items-center gap-1.5 text-sm break-words text-gray-500 sm:gap-2.5",
      className
    )}
    ref={ref}
    {...props}
  />
);

BreadcrumbList.displayName = "BreadcrumbList";

export { BreadcrumbList };
