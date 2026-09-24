import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

import { PaginationLink } from "../pagination-link";

const PaginationFirst = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to first page"
    className={cn("pr-2.5", className)}
    size="default"
    {...props}
  >
    First
  </PaginationLink>
);

PaginationFirst.displayName = "PaginationFirst";

export { PaginationFirst };
