import type { InputProps } from "@/components/ui/input";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputGroupInput = ({ className, ...props }: InputProps) => (
  <Input
    className={cn(
      "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0",
      className
    )}
    data-slot="input-group-control"
    {...props}
  />
);

export { InputGroupInput };
