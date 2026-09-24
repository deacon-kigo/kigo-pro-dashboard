import type { HTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

const TableCaption = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: React.Ref<HTMLTableCaptionElement>;
}) => (
  <caption
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    ref={ref}
    {...props}
  />
);

TableCaption.displayName = "TableCaption";

export { TableCaption };
