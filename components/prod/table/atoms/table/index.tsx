import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const Table = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableElement> & {
  ref?: React.Ref<HTMLTableElement>;
}) => (
  <table
    className={cn("w-full caption-bottom overflow-auto text-sm", className)}
    ref={ref}
    {...props}
  />
);

Table.displayName = "Table";

export { Table };
