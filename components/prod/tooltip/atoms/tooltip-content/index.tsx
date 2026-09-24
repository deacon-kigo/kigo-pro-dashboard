import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentRef,
} from "react";

import { Content, Portal } from "@radix-ui/react-tooltip";

import { cn } from "@/components/prod/utils/cn";

interface TooltipContentProps extends Omit<
  ComponentPropsWithoutRef<typeof Content>,
  "sideOffset"
> {
  sideOffset?: ComponentProps<typeof Content>["sideOffset"] | undefined;
}

const TooltipContent = ({
  className,
  ref,
  sideOffset = 4,
  ...props
}: TooltipContentProps & {
  ref?: React.Ref<ComponentRef<typeof Content>>;
}) => (
  <Portal>
    <Content
      className={cn(
        "group z-150 max-w-xs rounded bg-gray-900 px-3 py-1.5 text-sm leading-snug whitespace-normal text-white shadow-lg ring-1 ring-gray-900/20",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      data-testid="tooltip-content"
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </Portal>
);

TooltipContent.displayName = Content.displayName;

export { TooltipContent };
