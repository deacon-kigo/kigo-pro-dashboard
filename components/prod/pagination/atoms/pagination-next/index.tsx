import type { ComponentProps } from "react";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

import { PaginationLink } from "../pagination-link";

const PaginationNext = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1 pr-2.5", className)}
    data-testid="pagination-next"
    size="default"
    {...props}
  >
    <span>Next</span>
    <ChevronRightIcon className="size-4" />
  </PaginationLink>
);

PaginationNext.displayName = "PaginationNext";

export { PaginationNext };
