import type * as React from "react";

import { cn } from "@/components/prod/utils/cn";

const BreadcrumbPage = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  ref?: React.Ref<HTMLSpanElement>;
}) => (
  <span
    aria-current="page"
    className={cn("font-normal text-gray-900", className)}
    ref={ref}
    {...props}
  />
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export { BreadcrumbPage };
