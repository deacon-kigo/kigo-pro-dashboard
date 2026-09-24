import type * as React from "react";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    aria-hidden="true"
    className={cn("flex items-center", className)}
    data-testid="breadcrumb-separator"
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRightIcon className="size-3" />}
  </li>
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export { BreadcrumbSeparator };
