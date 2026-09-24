import type { ComponentProps } from "react";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-10 items-center justify-center", className)}
    data-testid="pagination-ellipsis"
    {...props}
  >
    <EllipsisHorizontalIcon className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export { PaginationEllipsis };
