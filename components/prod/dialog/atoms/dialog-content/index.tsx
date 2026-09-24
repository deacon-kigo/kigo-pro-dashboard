import { XMarkIcon } from "@heroicons/react/24/outline";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/components/prod/utils/cn";

import { DialogOverlay } from "../dialog-overlay";

interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  hasCloseButton?: boolean;
}

const DialogContent = ({
  children,
  className,
  hasCloseButton = true,
  ref,
  ...props
}: DialogContentProps & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
}) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed top-[50%] left-[50%] z-50 grid w-full max-w-xl translate-x-[-50%]",
        "translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-200",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      )}
      data-testid="dialog-content"
      ref={ref}
      {...props}
    >
      {children}
      {hasCloseButton && (
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
          <XMarkIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

export { DialogContent };
