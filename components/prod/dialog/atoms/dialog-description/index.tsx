import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/components/prod/utils/cn";

const DialogDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Description>>;
}) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-gray-500", className)}
    ref={ref}
    {...props}
  />
);

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { DialogDescription };
