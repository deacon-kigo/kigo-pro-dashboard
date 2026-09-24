import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

import { PaginationLink } from "../pagination-link";

const PaginationLast = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to last page"
    className={cn("pl-2.5", className)}
    size="default"
    {...props}
  >
    Last
  </PaginationLink>
);

PaginationLast.displayName = "PaginationLast";

export { PaginationLast };
