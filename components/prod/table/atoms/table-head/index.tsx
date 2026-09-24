import type { ThHTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableHead = ({
  className,
  ref,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.Ref<HTMLTableCellElement>;
}) => (
  <th
    className={cn(
      "text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
      "[&:not(:has([role=checkbox]))]:hover:bg-gray-50",
      className
    )}
    ref={ref}
    {...props}
  />
);

TableHead.displayName = "TableHead";

export { TableHead };
