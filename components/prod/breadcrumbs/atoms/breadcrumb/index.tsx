import type * as React from "react";

import { cn } from "@/components/prod/utils/cn";

const Breadcrumb = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"nav"> & {
  ref?: React.Ref<HTMLElement>;
} & {
  separator?: React.ReactNode;
}) => (
  <nav
    aria-label="breadcrumb"
    ref={ref}
    {...props}
    className={cn("flex flex-wrap", className)}
  />
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
