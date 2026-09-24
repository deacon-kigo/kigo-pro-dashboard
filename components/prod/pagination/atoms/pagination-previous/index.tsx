import type { ComponentProps } from "react";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

import { PaginationLink } from "../pagination-link";

const PaginationPrevious = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5", className)}
    size="default"
    {...props}
  >
    <ChevronLeftIcon className="size-4" />
    <span>Previous</span>
  </PaginationLink>
);

PaginationPrevious.displayName = "PaginationPrevious";

export { PaginationPrevious };
