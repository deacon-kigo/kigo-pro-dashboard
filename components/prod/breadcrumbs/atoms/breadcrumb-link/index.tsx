import type * as React from "react";

import Link from "@/components/prod/_runtime/link";

import { cn } from "@/components/prod/utils/cn";

const BreadcrumbLink = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  ref?: React.Ref<HTMLAnchorElement>;
}) => (
  <Link
    className={cn("transition-colors hover:text-gray-900", className)}
    ref={ref}
    {...props}
  />
);

BreadcrumbLink.displayName = "BreadcrumbLink";

export { BreadcrumbLink };
