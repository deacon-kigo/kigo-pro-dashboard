import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/components/prod/utils/cn";

const DialogOverlay = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Overlay>>;
}) => (
  <DialogPrimitive.Overlay
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className
    )}
    ref={ref}
    {...props}
  />
);

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export { DialogOverlay };
