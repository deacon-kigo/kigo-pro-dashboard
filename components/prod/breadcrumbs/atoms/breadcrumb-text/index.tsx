import type * as React from "react";

import { cn } from "@/components/prod/utils/cn";

/*
 * A non-navigable breadcrumb crumb: a structural/wrapper segment that has no
 * page of its own (e.g. `edit-offer` in `/offer-manager/edit-offer/:id`).
 *
 * Rendered as plain, non-interactive text — no `role="link"` (nothing to
 * activate) and no `aria-current="page"` (it is not the current page; the
 * terminal crumb is). Screen readers announce it as ordinary text inside the
 * breadcrumb `nav`, which is the correct semantics for a non-navigable label.
 */
const BreadcrumbText = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  ref?: React.Ref<HTMLSpanElement>;
}) => (
  <span
    className={cn("font-normal text-gray-500", className)}
    ref={ref}
    {...props}
  />
);

BreadcrumbText.displayName = "BreadcrumbText";

export { BreadcrumbText };
