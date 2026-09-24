import type { ButtonProps } from "@/components/prod/button";

import { Button } from "@/components/prod/button";
import { cn } from "@/components/prod/utils/cn";

type PaginationLinkProps = ButtonProps & {
  href: string;
  isActive?: boolean;
  isDisabled?: boolean;
};

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    aria-disabled={isDisabled}
    className={cn(
      "text-sm",
      isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
      className
    )}
    color="secondary"
    prefetch={true}
    size={size}
    variant={isActive ? "outline" : "ghost"}
    {...props}
  />
);

PaginationLink.displayName = "PaginationLink";

export { PaginationLink };
