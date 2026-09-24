import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableRow = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & {
  ref?: React.Ref<HTMLTableRowElement>;
}) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-blue-50/80",
      className
    )}
    ref={ref}
    {...props}
  />
);

TableRow.displayName = "TableRow";

export { TableRow };
