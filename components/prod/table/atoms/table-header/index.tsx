import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableHeader = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <thead
    className={cn("[&_tr]:border-b [&_tr]:hover:bg-transparent", className)}
    ref={ref}
    {...props}
  />
);

TableHeader.displayName = "TableHeader";

export { TableHeader };
