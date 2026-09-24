import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

const PaginationWrapper = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    className={cn("flex", className)}
    role="navigation"
    {...props}
  />
);

PaginationWrapper.displayName = "PaginationWrapper";

export { PaginationWrapper };
