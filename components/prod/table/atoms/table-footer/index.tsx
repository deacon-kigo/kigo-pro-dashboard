import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableFooter = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <tfoot
    className={cn(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className
    )}
    ref={ref}
    {...props}
  />
);

TableFooter.displayName = "TableFooter";

export { TableFooter };
