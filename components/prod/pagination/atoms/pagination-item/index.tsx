import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

const PaginationItem = ({
  className,
  ref,
  ...props
}: ComponentProps<"li"> & { ref?: React.Ref<HTMLLIElement> }) => (
  <li className={cn(className)} ref={ref} {...props} />
);

PaginationItem.displayName = "PaginationItem";

export { PaginationItem };
