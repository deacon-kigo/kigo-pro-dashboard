import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableBody = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <tbody
    className={cn("[&_tr:last-child]:border-0", className)}
    ref={ref}
    {...props}
  />
);

TableBody.displayName = "TableBody";

export { TableBody };
