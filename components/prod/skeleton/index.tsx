import { cn } from "@/components/prod/utils/cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-foreground/30 h-4 w-full animate-pulse rounded-sm",
      className
    )}
    data-testid="skeleton"
    {...props}
  />
);

export { Skeleton };
