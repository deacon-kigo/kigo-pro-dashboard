import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

const PaginationContent = ({
  className,
  ref,
  ...props
}: ComponentProps<"ul"> & {
  ref?: React.Ref<HTMLUListElement>;
}) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    ref={ref}
    {...props}
  />
);

PaginationContent.displayName = "PaginationContent";

export { PaginationContent };
