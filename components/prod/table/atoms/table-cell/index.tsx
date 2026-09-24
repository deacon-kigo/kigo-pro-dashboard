import type { TdHTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableCell = ({
  className,
  ref,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.Ref<HTMLTableCellElement>;
}) => (
  <td
    className={cn("p-4 [&:has([role=checkbox])]:pr-0", className)}
    ref={ref}
    {...props}
  />
);

TableCell.displayName = "TableCell";

export { TableCell };
