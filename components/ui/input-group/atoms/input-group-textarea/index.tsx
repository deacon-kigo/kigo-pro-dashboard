import type { TextareaProps } from "@/components/ui/textarea";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const InputGroupTextarea = ({ className, ...props }: TextareaProps) => (
  <Textarea
    className={cn(
      "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0",
      className
    )}
    data-slot="input-group-control"
    {...props}
  />
);

export { InputGroupTextarea };
