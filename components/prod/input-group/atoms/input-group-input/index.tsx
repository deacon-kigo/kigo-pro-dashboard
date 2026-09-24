import type { InputProps } from "@/components/prod/input";

import { Input } from "@/components/prod/input";
import { cn } from "@/components/prod/utils/cn";

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
