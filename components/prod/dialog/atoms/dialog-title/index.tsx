import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/components/prod/utils/cn";

const DialogTitle = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Title>>;
}) => (
  <DialogPrimitive.Title
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className
    )}
    ref={ref}
    {...props}
  />
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

export { DialogTitle };
